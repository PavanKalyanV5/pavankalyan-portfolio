"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { animate, stagger, svg, type JSAnimation } from "animejs";
import { sceneState } from "@/lib/sceneState";
import { sfx } from "@/lib/sfx";
import { OVERVIEW_LABELS, SPECIMENS } from "./specimens";

/**
 * One master machine, in the manner of the anime.js homepage telescope.
 *
 * The five drawings are modules of one launch vehicle: a payload stack threaded on a single
 * dashed axis and joined by flanged couplers, sealed inside a rocket body at the top of the
 * page. The first scroll is stage separation: the nose lifts away, the stage tubes slide apart
 * and the engine drops while the modules inside pull apart. A pulse runs down the axis, a
 * request passing through the whole stack. From there the camera travels down the axis. The focused module scales up and explodes into its detailed parts and labels while
 * the rest of the machine ghosts out. Scrolling back reassembles everything.
 *
 * Every module also works: parts spin, bob in a stagger, and accent dots travel through them.
 *
 * Responsive: with room beside the text (1180px and up) the machine sits to the right with leader
 * labels. On narrower screens it becomes a faint backdrop behind the text and the labels are hidden.
 */

/** Label sets: 0 is the overview, 1..5 are the detailed labels of modules 0..4. */
const SETS = [OVERVIEW_LABELS.map((l) => l as string), ...SPECIMENS.map((sp) => sp.labels.map((l) => l.label))];

type CalloutEl = { g: SVGGElement | null; path: SVGPathElement | null; text: SVGTextElement | null; dot: SVGCircleElement | null };
const registry: CalloutEl[][] = SETS.map((set) => set.map(() => ({ g: null, path: null, text: null, dot: null })));
const groups: (SVGGElement | null)[] = SETS.map(() => null);
let playIntro: ((k: number) => void) | null = null;

const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

const OVERVIEW_TILT: [number, number] = [0.38, -0.5];
/** How far each module is pulled apart in the overview, as a fraction of its detailed gap. */
const OVERVIEW_GAP = 0.4;
/** Space between modules along the master axis, in master units. */
const MODULE_GAP = 0.75;
/** How tightly the modules are packed while sealed inside the housing. */
const SEALED_GAP = 0.06;
const SEALED_MODULE_GAP = 0.12;
const DOT_RADIUS = 0.055;
/** How much larger a module is drawn while its own section is on screen. */
const MAGNIFY = 1.3;
/** Matches the number of ticks drawn on the scroll scrubber. */
const SCRUBBER_TICKS = 48;

/** Hard-edge outline of a solid. Knurled faces have shallow dihedral angles, so they get a small threshold. */
function outline(g: THREE.BufferGeometry, threshold?: number) {
  const e = new THREE.EdgesGeometry(g, threshold ?? (g instanceof THREE.CylinderGeometry && g.parameters.radialSegments >= 40 ? 1 : 25));
  g.dispose();
  return e;
}

const ring = (r: number, tube: number) => new THREE.TorusGeometry(r, tube, 8, 56).rotateX(Math.PI / 2);

/** Revolve a profile of [radius, y] pairs into a fine wireframe, so meridians and rings both show. */
const lathe = (pts: [number, number][], seg: number) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);

/**
 * The rocket body, built to wrap the whole payload stack: an ogive nose, three ribbed stage
 * tubes joined by interstage rings, four fins, and an engine bell. Parts are listed top to bottom.
 */
function buildBody(total: number) {
  const R = 1.3;
  const noseH = 1.7;
  const engineH = 1.2;
  const hb = Math.max(0.8, (total - noseH - engineH) / 3);
  const tube = () => new THREE.CylinderGeometry(R, R, hb, 48, 1, true);
  const band = (y: number) => ring(R + 0.025, 0.014).translate(0, y, 0);

  const nose = lathe(
    Array.from({ length: 21 }, (_, i) => {
      const t = i / 20;
      return [R * Math.pow(Math.sin(((1 - t) * Math.PI) / 2), 0.92), -noseH / 2 + t * noseH] as [number, number];
    }),
    48,
  );
  const bell = lathe(
    Array.from({ length: 15 }, (_, i) => {
      const t = i / 14;
      return [0.45 + (R * 0.95 - 0.45) * t * t, engineH / 2 - t * engineH] as [number, number];
    }),
    40,
  );
  const fin = (a: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(R - 0.02, 0.15);
    shape.lineTo(R + 0.85, -0.55);
    shape.lineTo(R + 0.85, -0.95);
    shape.lineTo(R - 0.02, -0.95);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false }).translate(0, 0, -0.025).rotateY(a);
  };

  const defs: { h: number; solids: THREE.BufferGeometry[]; fine?: THREE.BufferGeometry[] }[] = [
    { h: noseH, solids: [ring(R + 0.03, 0.02).translate(0, -noseH / 2, 0)], fine: [nose] },
    { h: hb, solids: [tube(), band(hb * 0.45), band(-hb * 0.45)] },
    {
      h: hb,
      solids: [
        tube(),
        band(hb * 0.45),
        band(-hb * 0.45),
        ...[0, 1, 2, 3].map((i) => {
          const a = (i * Math.PI) / 2 + Math.PI / 4;
          return new THREE.CylinderGeometry(0.22, 0.22, 0.1, 24).rotateX(Math.PI / 2).rotateY(-a + Math.PI / 2).translate(Math.cos(a) * (R + 0.02), 0, Math.sin(a) * (R + 0.02));
        }),
      ],
    },
    { h: hb, solids: [tube(), band(hb * 0.45), band(-hb * 0.45), ...[0, 1, 2, 3].map((i) => fin((i * Math.PI) / 2))] },
    { h: engineH, solids: [ring(0.5, 0.025).translate(0, engineH / 2, 0)], fine: [bell] },
  ];
  const sum = defs.reduce((n, d) => n + d.h, 0);
  let y = sum / 2;
  return defs.map((d) => {
    y -= d.h / 2;
    const centre = y;
    y -= d.h / 2;
    return { centre, edges: [...d.solids.map((g) => outline(g)), ...(d.fine ?? []).map((g) => outline(g, 1))] };
  });
}

/** One flanged coupler: two rings joined by four bolts, drawn where two modules meet. */
function buildCoupler() {
  const parts = [
    ring(0.5, 0.02).translate(0, 0.05, 0),
    ring(0.5, 0.02).translate(0, -0.05, 0),
    ...[0, 1, 2, 3].map((i) => {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      return new THREE.CylinderGeometry(0.035, 0.035, 0.2, 12).translate(Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5);
    }),
  ];
  return parts.map((g) => outline(g, 25));
}

export function Specimens({ palette, morph }: { palette: { ink: { current: THREE.Color }; accent: { current: THREE.Color } }; morph: { current: number } }) {
  const master = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const mods = useRef<(THREE.Group | null)[]>([]);
  const partRefs = useRef<(THREE.Group | null)[][]>(SPECIMENS.map(() => []));
  const innerRefs = useRef<(THREE.Group | null)[][]>(SPECIMENS.map(() => []));
  const actorRefs = useRef<(THREE.Mesh | null)[][][]>(SPECIMENS.map((sp) => sp.parts.map(() => [])));
  const mats = useRef<THREE.LineBasicMaterial[][]>(SPECIMENS.map(() => []));
  const accents = useRef<THREE.MeshBasicMaterial[][]>(SPECIMENS.map(() => []));
  const shellRefs = useRef<(THREE.Group | null)[]>([]);
  const shellMats = useRef<THREE.LineBasicMaterial[]>([]);
  const shellGroup = useRef<THREE.Group>(null);
  const couplerRefs = useRef<(THREE.Group | null)[]>([]);
  const couplerMats = useRef<THREE.LineBasicMaterial[]>([]);
  const spineRef = useRef<THREE.Line>(null);
  const leaving = useRef<boolean[]>(SETS.map(() => false));
  const scrollPrev = useRef({ y: 0, v: 0 });
  const pulseY = useRef(0);
  const detent = useRef(-1);
  const opened = useRef(false);
  const sealedInit = useRef(false);
  const pulse = useRef<THREE.Mesh>(null);
  const pulseMat = useRef<THREE.MeshBasicMaterial>(null);
  const shown = useRef<boolean[]>(SETS.map(() => false));
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  // Hard-edge outlines only, so the drawing stays crisp instead of showing triangle meshes.
  const built = useMemo(
    () =>
      SPECIMENS.map((sp) => {
        let half = 0.1;
        const parts = sp.parts.map((part) => ({
          edges: part.solids().map((g) => {
            const e = outline(g);
            e.computeBoundingBox();
            const bb = e.boundingBox!;
            half = Math.max(half, Math.abs(bb.min.x), Math.abs(bb.max.x), Math.abs(bb.min.z), Math.abs(bb.max.z));
            return e;
          }),
          lines: part.lines?.() ?? null,
        }));
        return { parts, half };
      }),
    [],
  );
  useEffect(
    () => () =>
      built.forEach((m) =>
        m.parts.forEach((b) => {
          b.edges.forEach((e) => e.dispose());
          b.lines?.dispose();
        }),
      ),
    [built],
  );

  // Overview scale of each module, so every module occupies a similar footprint on the axis.
  const overview = useMemo(() => {
    const scales = built.map((m, k) => {
      const sp = SPECIMENS[k];
      const stack = sp.parts.reduce((n, p) => n + p.h, 0) + sp.gap * OVERVIEW_GAP * (sp.parts.length - 1);
      return Math.min(1.7 / (m.half * 2), 1.9 / stack);
    });
    const total =
      SPECIMENS.reduce((n, sp, k) => n + (sp.parts.reduce((a, p) => a + p.h, 0) + sp.gap * OVERVIEW_GAP * (sp.parts.length - 1)) * scales[k], 0) +
      MODULE_GAP * (SPECIMENS.length - 1);
    return { scales, total };
  }, [built]);

  const housing = useMemo(() => buildBody(overview.total * 1.08), [overview.total]);
  const coupler = useMemo(() => buildCoupler(), []);
  const dotGeometry = useMemo(() => new THREE.SphereGeometry(DOT_RADIUS, 12, 12), []);
  // The dashed axis every module is threaded on, as drawn in technical exploded views.
  const spine = useMemo(() => {
    const geo = new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(6), 3));
    const line = new THREE.Line(geo, new THREE.LineDashedMaterial({ dashSize: 0.16, gapSize: 0.1, transparent: true }));
    line.frustumCulled = false;
    return line;
  }, []);
  useEffect(
    () => () => {
      housing.forEach((h) => h.edges.forEach((e) => e.dispose()));
      coupler.forEach((e) => e.dispose());
      dotGeometry.dispose();
      spine.geometry.dispose();
      (spine.material as THREE.Material).dispose();
    },
    [housing, coupler, dotGeometry, spine],
  );

  useFrame((state, delta) => {
    const m = morph.current;
    const reduced = sceneState.reducedMotion;
    const t = reduced ? 0 : state.clock.elapsedTime;
    // With room beside the text the machine sits to the right with labels; otherwise it is a faint backdrop.
    const side = size.width >= 1180;
    const ghost = side ? 1 : 0.3;
    const mst = master.current;
    const inn = inner.current;
    if (!mst || !inn) return;
    mst.visible = true;

    // Focus of each module: 0 in the overview, 1 when its own section (scene k + 1) is on screen.
    const focus = SPECIMENS.map((_, k) => smooth(1 - Math.abs(m - (k + 1)) * 1.7));
    const fMax = Math.max(...focus);
    const fSum = focus.reduce((a, b) => a + b, 0);
    const py = sceneState.pointer.y * 0.5 + 0.5;
    // The first screenful of scrolling opens the housing and pulls the modules apart.
    const open = smooth(window.scrollY / (window.innerHeight * 0.85));

    const fit = THREE.MathUtils.clamp(viewport.width / 7.4, 0.55, 1.3) * 0.62;
    const masterScale = Math.min((0.78 * viewport.height) / overview.total, fit * 1.1);

    // Lay the modules out along the axis at their current scale and gap, top to bottom.
    const centres: number[] = [];
    const joints: number[] = [];
    let cursor = 0;
    let lastGap = 0;
    SPECIMENS.forEach((sp, k) => {
      const f = focus[k];
      const detail = (fit * sp.scale * MAGNIFY) / masterScale;
      const scale = THREE.MathUtils.lerp(overview.scales[k], detail, f);
      const gapF = THREE.MathUtils.lerp(THREE.MathUtils.lerp(SEALED_GAP, OVERVIEW_GAP, open), 0.82 + 0.18 * py, f);
      const stack = sp.parts.reduce((n, p) => n + p.h, 0) + sp.gap * gapF * (sp.parts.length - 1);
      const height = stack * scale;
      const centre = cursor - height / 2;
      centres.push(centre);
      lastGap = THREE.MathUtils.lerp(SEALED_MODULE_GAP, MODULE_GAP, open) * (1 - 0.35 * f);
      cursor -= height + lastGap;
      if (k < SPECIMENS.length - 1) joints.push(cursor + lastGap / 2);

      const mod = mods.current[k];
      if (!mod) return;
      mod.scale.setScalar(scale);
      mod.position.set(0, centre, 0);
      let y = stack / 2;
      sp.parts.forEach((p, i) => {
        y -= p.h / 2;
        partRefs.current[k][i]?.position.set(0, y, 0);
        y -= p.h / 2 + sp.gap * gapF;
      });

      // Non-focused modules ghost out while another one is being examined.
      const opacity = 1 - (1 - f) * fMax;
      for (const mat of mats.current[k]) {
        mat.color.copy(palette.ink.current);
        mat.opacity = 0.72 * opacity * ghost;
      }
      for (const mat of accents.current[k]) {
        mat.color.copy(palette.accent.current);
        mat.opacity = opacity * ghost;
      }

      // Small working motion inside each part.
      sp.parts.forEach((part, i) => {
        const inner = innerRefs.current[k][i];
        if (inner && part.anim) part.anim(inner, t);
        const geo = built[k].parts[i].lines;
        if (geo && part.lineAnim) {
          const attr = geo.getAttribute("position") as THREE.BufferAttribute;
          part.lineAnim(attr.array as Float32Array, t);
          attr.needsUpdate = true;
        }
        part.actors?.forEach((actor, a) => {
          const dot = actorRefs.current[k][i][a];
          if (dot) dot.position.set(...actor.path(t));
        });
      });
    });

    // Centre the machine on the focused module (or on the whole machine in the overview).
    const overallCentre = cursor / 2 + MODULE_GAP / 2;
    const blend = overallCentre * (1 - fSum) + focus.reduce((a, f, k) => a + f * centres[k], 0);
    inn.position.set(0, -blend, 0);

    // Ambience follows scroll speed and the current section.
    const dtSafe = Math.max(0.001, delta);
    const speed = Math.min(1, Math.abs(window.scrollY - scrollPrev.current.y) / dtSafe / 3000);
    scrollPrev.current.y = window.scrollY;
    scrollPrev.current.v += (speed - scrollPrev.current.v) * 0.15;
    sfx.scroll(scrollPrev.current.v, m);

    // A ratchet click every time the scrubber playhead crosses one of its ruler ticks.
    const span = document.documentElement.scrollHeight - window.innerHeight;
    const tick = span > 0 ? Math.floor((window.scrollY / span) * SCRUBBER_TICKS) : 0;
    if (detent.current >= 0 && tick !== detent.current) sfx.detent(tick > detent.current ? 1 : -1);
    detent.current = tick;

    // Stage separation and its reverse each get a sound, once per crossing.
    if (!sealedInit.current) {
      sealedInit.current = true;
      opened.current = open > 0.1;
    } else if (!opened.current && open > 0.1) {
      opened.current = true;
      sfx.stageSeparation();
    } else if (opened.current && open < 0.04) {
      opened.current = false;
      sfx.stageClose();
    }

    // The housing sits around the sealed stack, then twists and slides away as it opens.
    const sg = shellGroup.current;
    // Sealed it is solid; dissected it stays as a ghost through the overview, and is gone once the camera moves on.
    const sealed = 1 - smooth(open * 1.1);
    const housingOpacity = (1 - 0.7 * smooth(open)) * (1 - smooth(m * 1.8));
    if (sg) {
      sg.visible = housingOpacity > 0.01;
      sg.position.set(0, (cursor + lastGap) / 2, 0);
      housing.forEach((h, j) => {
        const g = shellRefs.current[j];
        if (!g) return;
        const dir = j % 2 ? 1 : -1;
        // Top stages travel up and bottom stages travel down, so the body separates outward.
        g.position.set(0, h.centre + ((housing.length - 1) / 2 - j) * 1.1 * open * (1 + 0.3 * open), 0);
        g.rotation.y = dir * open * 0.9 + t * 0.08 * dir;
        g.scale.set(1 + 0.15 * open, 1, 1 + 0.15 * open);
      });
      for (const mat of shellMats.current) {
        mat.color.copy(palette.ink.current);
        mat.opacity = 0.5 * housingOpacity * ghost;
      }
    }

    // Couplers join neighbouring modules, and the dashed axis runs through all of them.
    const linkOpacity = 1 - fMax;
    joints.forEach((y, j) => couplerRefs.current[j]?.position.set(0, y, 0));
    for (const mat of couplerMats.current) {
      mat.color.copy(palette.ink.current);
      mat.opacity = 0.6 * linkOpacity * ghost;
    }
    const topY = 0.45;
    const bottomY = cursor + lastGap - 0.45;
    const sl = spineRef.current;
    if (sl) {
      const pos = sl.geometry.getAttribute("position") as THREE.BufferAttribute;
      pos.setXYZ(0, 0, topY, 0);
      pos.setXYZ(1, 0, bottomY, 0);
      pos.needsUpdate = true;
      sl.computeLineDistances();
      const sm = sl.material as THREE.LineDashedMaterial;
      sm.color.copy(palette.ink.current);
      sm.opacity = 0.5 * linkOpacity * ghost;
    }
    // A request enters at the top, passes through every module, and leaves at the bottom.
    const pulseNow = topY + (bottomY - topY) * ((t * 0.16) % 1);
    if (pulse.current) pulse.current.position.set(0, pulseNow, 0);
    // The pulse pings as it passes each coupler, while the couplers are in view.
    if (linkOpacity > 0.5 && !document.hidden && !reduced) {
      joints.forEach((jy, j) => {
        if (pulseY.current > jy && pulseNow <= jy) sfx.ping(j);
      });
    }
    pulseY.current = pulseNow;
    if (pulseMat.current) {
      pulseMat.current.color.copy(palette.accent.current);
      pulseMat.current.opacity = linkOpacity * ghost;
    }

    mst.scale.setScalar(masterScale);
    mst.position.set(viewport.width * (side ? 0.17 + focus.reduce((a, f, k) => a + f * (SPECIMENS[k].offsetX ?? 0), 0) : 0.08), 0, 0);
    const rx = OVERVIEW_TILT[0] * (1 - fSum) + focus.reduce((a, f, k) => a + f * SPECIMENS[k].tilt[0], 0);
    const rz = OVERVIEW_TILT[1] * (1 - fSum) + focus.reduce((a, f, k) => a + f * SPECIMENS[k].tilt[1], 0);
    // A gentle sway keeps leader lines on the right-hand side instead of letting the drawing spin round.
    mst.rotation.set(rx, 0.35 + Math.sin(t * 0.25) * 0.18 + sceneState.pointer.x * 0.45, rz + sceneState.pointer.y * 0.08);

    // Label sets: the overview fades out as any module takes focus.
    const presence = [1 - fMax, ...focus].map((p) => smooth(p));
    const W = groups[0]?.ownerSVGElement?.clientWidth || size.width;
    const H = groups[0]?.ownerSVGElement?.clientHeight || size.height;
    mst.updateMatrixWorld(true);
    SETS.forEach((labels, s) => {
      const g = groups[s];
      if (g) g.style.opacity = String(side ? presence[s] : 0);
      if (shown.current[s] && presence[s] < 0.3 && !leaving.current[s]) {
        leaving.current[s] = true;
        sfx.fold(s === 0 ? 5 : SPECIMENS[s - 1].parts.length);
      }
      if (presence[s] > 0.5) leaving.current[s] = false;
      if (presence[s] < 0.05) shown.current[s] = false;
      if (presence[s] <= 0.01) return;
      if (presence[s] > 0.5 && !shown.current[s] && playIntro) {
        shown.current[s] = true;
        sfx.arrive(Math.max(0, s - 1), s === 0 ? 5 : SPECIMENS[s - 1].parts.length);
        sfx.leaders(labels.length);
        playIntro(s);
      }
      labels.forEach((label, i) => {
        const el = registry[s][i];
        if (!el.path || !el.text || !el.dot) return;
        if (s === 0 && i === 0) {
          const nose = shellRefs.current[0];
          if (!nose) return;
          tmp.set(1.0, 0, 0);
          nose.localToWorld(tmp);
        } else if (s === 0) {
          const mod = mods.current[i - 1];
          if (!mod) return;
          tmp.set(built[i - 1].half, 0, 0);
          mod.localToWorld(tmp);
        } else {
          const spec = SPECIMENS[s - 1];
          const part = partRefs.current[s - 1][spec.labels[i].part];
          if (!part) return;
          tmp.set(spec.parts[spec.labels[i].part].reach, 0, 0);
          part.localToWorld(tmp);
        }
        tmp.project(camera);
        const ax = (tmp.x * 0.5 + 0.5) * W;
        const ay = (-tmp.y * 0.5 + 0.5) * H;
        const labelY = H * 0.14 + i * 27;
        const lx = W - 28 - label.length * 7.6 - 12;
        const ex = Math.min(ax + Math.abs(labelY - ay), lx - 24);
        el.path.setAttribute("d", `M${ax.toFixed(1)} ${ay.toFixed(1)}L${ex.toFixed(1)} ${labelY.toFixed(1)}L${lx.toFixed(1)} ${labelY.toFixed(1)}`);
        el.text.setAttribute("x", String(W - 28));
        el.text.setAttribute("y", String(labelY + 4));
        el.dot.setAttribute("cx", ax.toFixed(1));
        el.dot.setAttribute("cy", ay.toFixed(1));
        // The label that names the housing goes with it when it opens.
        if (s === 0 && i === 0 && el.g) el.g.style.opacity = String(sealed);
      });
    });
  });

  const lineMat = (k: number) => (mat: THREE.LineBasicMaterial | null) => void (mat && !mats.current[k].includes(mat) && mats.current[k].push(mat));
  const accentMat = (k: number) => (mat: THREE.MeshBasicMaterial | null) => void (mat && !accents.current[k].includes(mat) && accents.current[k].push(mat));
  const shellMat = (mat: THREE.LineBasicMaterial | null) => void (mat && !shellMats.current.includes(mat) && shellMats.current.push(mat));

  return (
    <group ref={master} visible={false}>
      <group ref={inner}>
        <group ref={shellGroup}>
          {housing.map((h, j) => (
            <group key={j} ref={(el) => void (shellRefs.current[j] = el)}>
              {h.edges.map((geo, e) => (
                <lineSegments key={e} geometry={geo} frustumCulled={false}>
                  <lineBasicMaterial ref={shellMat} transparent />
                </lineSegments>
              ))}
            </group>
          ))}
        </group>
        <primitive ref={spineRef} object={spine} />
        <mesh ref={pulse} geometry={dotGeometry} frustumCulled={false}>
          <meshBasicMaterial ref={pulseMat} transparent />
        </mesh>
        {Array.from({ length: SPECIMENS.length - 1 }, (_, j) => (
          <group key={j} ref={(el) => void (couplerRefs.current[j] = el)}>
            {coupler.map((geo, e) => (
              <lineSegments key={e} geometry={geo} frustumCulled={false}>
                <lineBasicMaterial ref={(m) => void (m && !couplerMats.current.includes(m) && couplerMats.current.push(m))} transparent />
              </lineSegments>
            ))}
          </group>
        ))}
        {built.map((mod, k) => (
          <group key={SPECIMENS[k].id} ref={(el) => void (mods.current[k] = el)}>
            {mod.parts.map((part, i) => (
              <group key={i} ref={(el) => void (partRefs.current[k][i] = el)}>
                <group ref={(el) => void (innerRefs.current[k][i] = el)}>
                  {part.edges.map((geo, j) => (
                    <lineSegments key={j} geometry={geo} frustumCulled={false}>
                      <lineBasicMaterial ref={lineMat(k)} transparent />
                    </lineSegments>
                  ))}
                  {part.lines && (
                    <lineSegments geometry={part.lines} frustumCulled={false}>
                      <lineBasicMaterial ref={lineMat(k)} transparent />
                    </lineSegments>
                  )}
                </group>
                {SPECIMENS[k].parts[i].actors?.map((_, a) => (
                  <mesh key={a} ref={(el) => void (actorRefs.current[k][i][a] = el)} geometry={dotGeometry} frustumCulled={false}>
                    <meshBasicMaterial ref={accentMat(k)} transparent />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}

/** Leader lines and labels. Positions are driven per frame by Specimens; anime.js draws them in. */
export function Callouts() {
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const running: JSAnimation[] = [];
    playIntro = reduced
      ? null
      : (k) => {
          const g = el.querySelector(`[data-set="${k}"]`);
          if (!g) return;
          running.push(
            animate(svg.createDrawable(g.querySelectorAll("[data-leader]")), {
              draw: ["0 0", "0 1"],
              duration: 900,
              delay: stagger(110, { start: 250 }),
              ease: "outCubic",
            }),
            animate(g.querySelectorAll("[data-label], [data-anchor]"), {
              opacity: [0, 1],
              duration: 500,
              delay: stagger(110, { start: 500 }),
              ease: "outQuad",
            }),
          );
        };
    return () => {
      running.forEach((a) => a.revert());
      playIntro = null;
    };
  }, []);

  return (
    <svg ref={root} aria-hidden style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {SETS.map((labels, s) => (
        <g key={s} data-set={s} ref={(n) => void (groups[s] = n)} style={{ opacity: 0 }}>
          {labels.map((label, i) => (
            <g key={label} ref={(n) => void (registry[s][i].g = n)}>
              <path data-leader ref={(n) => void (registry[s][i].path = n)} fill="none" stroke="var(--ink)" strokeOpacity="0.45" strokeWidth="1" />
              <circle data-anchor ref={(n) => void (registry[s][i].dot = n)} r="2.5" fill="var(--sodium)" />
              <text
                data-label
                ref={(n) => void (registry[s][i].text = n)}
                textAnchor="end"
                fill="var(--ink)"
                fillOpacity="0.72"
                style={{ font: "500 12px ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.02em" }}
              >
                {label}
              </text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
