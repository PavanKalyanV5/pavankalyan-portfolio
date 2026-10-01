"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/lib/sceneState";
import { SHAPES } from "./shapes";

const vertex = /* glsl */ `
  attribute vec3 a1; attribute vec3 a2; attribute vec3 a3; attribute vec3 a4;
  attribute float aSeed;
  uniform float uMorph, uTime, uAspect, uPx, uSize, uPointerOn, uWarp;
  uniform vec2 uPointer;
  varying float vNear; varying float vDepth;

  void main() {
    float w0 = max(0.0, 1.0 - abs(uMorph));
    float w1 = max(0.0, 1.0 - abs(uMorph - 1.0));
    float w2 = max(0.0, 1.0 - abs(uMorph - 2.0));
    float w3 = max(0.0, 1.0 - abs(uMorph - 3.0));
    float w4 = max(0.0, 1.0 - abs(uMorph - 4.0));
    vec3 p = position * w0 + a1 * w1 + a2 * w2 + a3 * w3 + a4 * w4;

    float transit = 1.0 - (w0*w0 + w1*w1 + w2*w2 + w3*w3 + w4*w4);
    vec3 drift = vec3(
      sin(aSeed * 37.0 + uTime * 0.6),
      cos(aSeed * 51.0 + uTime * 0.5),
      sin(aSeed * 23.0 + uTime * 0.7)
    );
    p += drift * (0.035 + transit * 1.6);
    p *= 1.0 + uWarp * 0.22;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // The pointer is a query: nearby points are "retrieved", pulled in and swirled.
    vec2 ndc = gl_Position.xy / gl_Position.w;
    vec2 d = (ndc - uPointer) * vec2(uAspect, 1.0);
    float dist = length(d);
    float near = (1.0 - smoothstep(0.0, 0.36, dist)) * uPointerOn;
    vec2 dir = normalize(d + 1e-5);
    vec2 pull = -dir * near * 0.11 + vec2(-dir.y, dir.x) * near * 0.05;
    gl_Position.xy += pull / vec2(uAspect, 1.0) * gl_Position.w;

    float jitter = 0.55 + 0.9 * fract(aSeed * 91.7);
    gl_PointSize = uSize * uPx * jitter * (1.0 + near * 2.4 + uWarp * 0.6) * (11.0 / -mv.z);
    vNear = near;
    vDepth = clamp(1.0 - (-mv.z - 5.5) / 9.0, 0.25, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uInk; uniform vec3 uAccent; uniform float uAlpha;
  varying float vNear; varying float vDepth;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float edge = smoothstep(0.5, 0.32, r);
    vec3 col = mix(uInk, uAccent, smoothstep(0.0, 0.45, vNear));
    float a = edge * mix(0.34, 0.98, vNear) * vDepth * uAlpha;
    gl_FragColor = vec4(col, min(a, 1.0));
  }
`;

/** Theme colours come from CSS custom properties so one source of truth drives DOM and WebGL. */
function usePalette() {
  const ink = useRef(new THREE.Color("#101a2b"));
  const accent = useRef(new THREE.Color("#d9480f"));
  const boost = useRef(1);
  const targets = useRef({ ink: new THREE.Color("#101a2b"), accent: new THREE.Color("#d9480f"), boost: 1 });

  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      targets.current.ink.set(cs.getPropertyValue("--particle").trim() || "#101a2b");
      targets.current.accent.set(cs.getPropertyValue("--sodium").trim() || "#d9480f");
      targets.current.boost = parseFloat(cs.getPropertyValue("--particle-boost")) || 1;
    };
    read();
    // Snap on first read so there is no flash from the default palette.
    ink.current.copy(targets.current.ink);
    accent.current.copy(targets.current.accent);
    boost.current = targets.current.boost;
    window.addEventListener("themechange", read);
    return () => window.removeEventListener("themechange", read);
  }, []);

  const step = (k: number) => {
    ink.current.lerp(targets.current.ink, k);
    accent.current.lerp(targets.current.accent, k);
    boost.current += (targets.current.boost - boost.current) * k;
  };
  return { ink, accent, boost, step };
}

/** A wireframe probe that is the visible, 3D body of the pointer query. */
function Probe({ palette }: { palette: ReturnType<typeof usePalette> }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const mats = useRef<THREE.MeshBasicMaterial[]>([]);
  const target = useMemo(() => new THREE.Vector3(), []);
  const speed = useRef(0);
  const prev = useRef({ x: 0, y: 0 });
  const camera = useThree((s) => s.camera);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const idle = performance.now() - sceneState.lastPointerAt > 2600;
    const t = state.clock.elapsedTime;
    const px = idle ? Math.sin(t * 0.37) * 0.55 + 0.25 : sceneState.pointer.x;
    const py = idle ? Math.cos(t * 0.29) * 0.4 : sceneState.pointer.y;

    const vp = state.viewport.getCurrentViewport(camera, [0, 0, 2]);
    target.set((px * vp.width) / 2, (py * vp.height) / 2, 2);
    g.position.lerp(target, 1 - Math.exp(-dt * (idle ? 1.5 : 10)));

    const moved = Math.hypot(px - prev.current.x, py - prev.current.y) / Math.max(dt, 1e-3);
    prev.current = { x: px, y: py };
    speed.current += (Math.min(moved, 4) - speed.current) * (1 - Math.exp(-dt * 6));

    const s = 1 + speed.current * 0.28;
    g.scale.setScalar(s);
    if (core.current) {
      core.current.rotation.x += dt * (0.7 + speed.current);
      core.current.rotation.y += dt * (1.1 + speed.current);
    }
    if (ringA.current) ringA.current.rotation.set(Math.PI / 2.3 + Math.sin(t * 0.8) * 0.3, t * 0.9, 0);
    if (ringB.current) ringB.current.rotation.set(t * 0.6, Math.PI / 3, t * 0.4);

    for (const m of mats.current) {
      m.color.copy(palette.accent.current);
      m.opacity = sceneState.reducedMotion ? 0.5 : 0.85;
    }
  });

  const reg = (m: THREE.MeshBasicMaterial | null) => {
    if (m && !mats.current.includes(m)) mats.current.push(m);
  };

  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.16, 1]} />
        <meshBasicMaterial ref={reg} wireframe transparent />
      </mesh>
      <mesh ref={ringA}>
        <torusGeometry args={[0.36, 0.006, 8, 64]} />
        <meshBasicMaterial ref={reg} transparent />
      </mesh>
      <mesh ref={ringB}>
        <torusGeometry args={[0.55, 0.004, 8, 80]} />
        <meshBasicMaterial ref={reg} transparent />
      </mesh>
    </group>
  );
}

/** Gyroscope rings that frame the hero cloud and dissolve as the field morphs. */
function Gyro({ palette, morph }: { palette: ReturnType<typeof usePalette>; morph: React.RefObject<number> }) {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const mats = useRef<THREE.MeshBasicMaterial[]>([]);
  useFrame((state) => {
    const t = sceneState.reducedMotion ? 0 : state.clock.elapsedTime;
    if (outer.current) outer.current.rotation.set(Math.PI / 2 + Math.sin(t * 0.2) * 0.25, t * 0.12, 0);
    if (inner.current) inner.current.rotation.set(t * 0.1, Math.PI / 2.6, t * 0.08);
    const fade = Math.max(0, 1 - (morph.current ?? 0) * 1.6);
    for (const m of mats.current) {
      m.color.copy(palette.ink.current);
      m.opacity = fade * 0.2;
    }
  });
  const reg = (m: THREE.MeshBasicMaterial | null) => {
    if (m && !mats.current.includes(m)) mats.current.push(m);
  };
  return (
    <>
      <mesh ref={outer}>
        <torusGeometry args={[3.9, 0.005, 6, 160]} />
        <meshBasicMaterial ref={reg} transparent />
      </mesh>
      <mesh ref={inner}>
        <torusGeometry args={[3.3, 0.004, 6, 140]} />
        <meshBasicMaterial ref={reg} transparent />
      </mesh>
    </>
  );
}

function Field({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);
  const gl = useThree((s) => s.gl);
  const palette = usePalette();

  const geometry = useMemo(() => {
    const [s0, s1, s2, s3, s4] = SHAPES.map((fn) => fn(count));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(s0, 3));
    g.setAttribute("a1", new THREE.BufferAttribute(s1, 3));
    g.setAttribute("a2", new THREE.BufferAttribute(s2, 3));
    g.setAttribute("a3", new THREE.BufferAttribute(s3, 3));
    g.setAttribute("a4", new THREE.BufferAttribute(s4, 3));
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) seeds[i] = ((Math.sin(i * 12.9898) * 43758.5453) % 1) * 0.5 + 0.5;
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uPx: { value: 1 },
      uSize: { value: 2.4 },
      uWarp: { value: 0 },
      uPointerOn: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uInk: { value: new THREE.Color("#101a2b") },
      uAccent: { value: new THREE.Color("#d9480f") },
      uAlpha: { value: 1 },
    }),
    [],
  );
  const material = useRef<THREE.ShaderMaterial>(null);
  const morph = useRef(0);
  const pointer = useRef(new THREE.Vector2());
  const goal = useRef(new THREE.Vector2());
  const on = useRef(0);
  const scroll = useRef({ y: 0, warp: 0 });

  useFrame((state, delta) => {
    const mat = material.current;
    if (!mat) return;
    const u = mat.uniforms;
    const dt = Math.min(delta, 0.05);
    const reduced = sceneState.reducedMotion;
    const t = reduced ? 0 : state.clock.elapsedTime;

    palette.step(1 - Math.exp(-dt * 5));
    u.uInk.value.copy(palette.ink.current);
    u.uAccent.value.copy(palette.accent.current);

    morph.current += (sceneState.target - morph.current) * (1 - Math.exp(-dt * (reduced ? 12 : 2.4)));

    // Scroll velocity becomes a dolly-zoom: the whole field leans into fast scrolling.
    const sy = window.scrollY;
    const vel = Math.abs(sy - scroll.current.y) / Math.max(dt * 1000, 1);
    scroll.current.y = sy;
    scroll.current.warp += ((reduced ? 0 : Math.min(vel / 3.5, 1)) - scroll.current.warp) * (1 - Math.exp(-dt * 5));
    const warp = scroll.current.warp;
    const cam = state.camera as THREE.PerspectiveCamera;
    cam.fov = 45 + warp * 9;
    cam.updateProjectionMatrix();

    const idle = performance.now() - sceneState.lastPointerAt > 2600;
    goal.current.set(
      idle ? Math.sin(state.clock.elapsedTime * 0.37) * 0.55 + 0.25 : sceneState.pointer.x,
      idle ? Math.cos(state.clock.elapsedTime * 0.29) * 0.4 : sceneState.pointer.y,
    );
    pointer.current.lerp(goal.current, 1 - Math.exp(-dt * (idle ? 1.2 : 9)));
    on.current += ((reduced && idle ? 0 : 1) - on.current) * (1 - Math.exp(-dt * 4));

    u.uMorph.value = morph.current;
    u.uTime.value = t;
    u.uWarp.value = warp;
    u.uAspect.value = size.width / size.height;
    u.uPx.value = gl.getPixelRatio();
    u.uPointer.value.copy(pointer.current);
    u.uPointerOn.value = on.current;

    const wide = size.width >= 900;
    u.uAlpha.value = (wide ? 1 : 0.72) * palette.boost.current;
    if (group.current) {
      const fit = THREE.MathUtils.clamp(viewport.width / (wide ? 7.4 : 6.2), 0.55, 1.4);
      group.current.scale.setScalar(fit);
      group.current.position.x = wide ? viewport.width * 0.18 : 0;
      // The pointer steers the whole cloud, so the depth is obvious without clicking anything.
      group.current.rotation.y = t * 0.06 + morph.current * 0.7 + sceneState.pointer.x * 0.5;
      group.current.rotation.x = sceneState.pointer.y * -0.28 + Math.sin(morph.current * 1.3) * 0.12;
    }
  });

  return (
    <>
      <group ref={group}>
        <points geometry={geometry} frustumCulled={false}>
          <shaderMaterial
            ref={material}
            vertexShader={vertex}
            fragmentShader={fragment}
            uniforms={uniforms}
            transparent
            depthWrite={false}
          />
        </points>
        <Gyro palette={palette} morph={morph} />
      </group>
      <Probe palette={palette} />
    </>
  );
}

export default function ParticleField({ count }: { count: number }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
      aria-hidden
    >
      <Field count={count} />
    </Canvas>
  );
}
