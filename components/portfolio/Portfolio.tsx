"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MeshCanvas } from "@/components/mesh/MeshCanvas";
import { MeshScene } from "@/components/mesh/MeshScene";
import { CameraRig } from "@/components/mesh/CameraRig";
import { ParallaxGroup } from "@/components/mesh/ParallaxGroup";
import { Effects } from "@/components/mesh/Effects";
import { TopBar } from "@/components/overlay/TopBar";
import { NavRail } from "@/components/overlay/NavRail";
import { DetailPanel } from "@/components/overlay/DetailPanel";
import { ContactLauncher } from "@/components/overlay/ContactLauncher";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { StaticPortfolio } from "@/components/fallback/StaticPortfolio";
import { useCapabilities, shouldRender3D } from "@/lib/mesh/useCapabilities";
import { getLayerGraph } from "@/lib/mesh/layers";
import { LAYER_ORDER, type LayerId } from "@/lib/mesh/types";
import { LayerIntro } from "./LayerIntro";
import { BootSequence } from "./BootSequence";
import { ExperienceBoundary } from "./ExperienceBoundary";
import styles from "./Portfolio.module.css";

/** Overview hub node ids encode the layer they navigate to: "hub-experience" -> "experience". */
function hubTarget(nodeId: string): LayerId | null {
  if (!nodeId.startsWith("hub-")) return null;
  const candidate = nodeId.slice("hub-".length);
  return (LAYER_ORDER as string[]).includes(candidate) ? (candidate as LayerId) : null;
}

export function Portfolio() {
  const capabilities = useCapabilities();
  const [layer, setLayer] = useState<LayerId>("overview");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [booted, setBooted] = useState(false);

  const graph = useMemo(() => getLayerGraph(layer), [layer]);

  const selectedNode = useMemo(
    () => graph.nodes.find((node) => node.id === selectedId) ?? null,
    [graph, selectedId]
  );

  const hoveredNode = useMemo(
    () => graph.nodes.find((node) => node.id === hoveredId) ?? null,
    [graph, hoveredId]
  );

  const changeLayer = useCallback((next: LayerId) => {
    setLayer(next);
    setSelectedId(null);
    setHoveredId(null);
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      const target = hubTarget(id);
      if (target) {
        changeLayer(target);
        return;
      }
      setSelectedId((previous) => (previous === id ? null : id));
    },
    [changeLayer]
  );

  const closePanel = useCallback(() => setSelectedId(null), []);

  // Arrow keys step through the current layer's nodes so the whole experience is
  // reachable without a pointer.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const selectable = graph.nodes.filter((node) => !hubTarget(node.id));
      if (selectable.length === 0) return;

      event.preventDefault();
      const currentIndex = selectable.findIndex((node) => node.id === selectedId);
      const step = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex =
        currentIndex === -1
          ? 0
          : (currentIndex + step + selectable.length) % selectable.length;
      setSelectedId(selectable[nextIndex].id);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [graph, selectedId]);

  // Server render and the first client render land here, before capability
  // detection has run. Emitting the full static portfolio rather than a blank
  // screen is what puts real, indexable content in the initial HTML — a crawler
  // that never runs our effects still receives the whole site, and so does a
  // visitor with JavaScript disabled. Once detection completes, this is replaced
  // by the 3D experience. Progressive enhancement, not a separate page: it is
  // the same content either way.
  if (!capabilities.ready) {
    return <StaticPortfolio />;
  }

  if (!shouldRender3D(capabilities)) {
    // data-* attributes make it possible to confirm *why* the fallback rendered
    // by inspecting the element, rather than guessing.
    return (
      <div data-fallback-reason="no-webgl" data-webgl="false">
        <StaticPortfolio />
      </div>
    );
  }

  const still = capabilities.reducedMotion;
  const quality = capabilities.lowPower ? "low" : "high";
  const focus = selectedNode?.position ?? null;
  const cursorNode = hoveredNode ?? null;

  return (
    <ExperienceBoundary
      fallback={
        <div data-fallback-reason="runtime-error">
          <StaticPortfolio />
        </div>
      }
    >
      <CustomCursor />
      <TopBar />

      <div
        className={styles.canvasHost}
        data-cursor={cursorNode ? "node" : undefined}
        data-cursor-label={cursorNode?.label}
      >
        <MeshCanvas quality={quality}>
          <CameraRig home={graph.cameraHome} focus={focus} still={still} />
          <ParallaxGroup still={still}>
            <MeshScene
              graph={graph}
              hoveredId={hoveredId}
              selectedId={selectedId}
              onHover={setHoveredId}
              onSelect={handleSelect}
              still={still}
            />
          </ParallaxGroup>
          <Effects quality={quality} />
        </MeshCanvas>
      </div>

      {/* Mounted only after the boot trace clears, so the name reveal lands on an
          empty stage rather than animating unseen behind the overlay. */}
      {booted && <LayerIntro graph={graph} dimmed={selectedNode !== null} />}
      <NavRail active={layer} onSelect={changeLayer} />
      <DetailPanel node={selectedNode} onClose={closePanel} />
      {/* Collapsed by default and present on every layer, so the graph is never
          covered and the form is always one click away. */}
      <ContactLauncher />
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}
    </ExperienceBoundary>
  );
}
