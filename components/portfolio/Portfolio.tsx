"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MeshCanvas } from "@/components/mesh/MeshCanvas";
import { MeshScene } from "@/components/mesh/MeshScene";
import { CameraRig } from "@/components/mesh/CameraRig";
import { ParallaxGroup } from "@/components/mesh/ParallaxGroup";
import { Effects } from "@/components/mesh/Effects";
import { TopBar } from "@/components/overlay/TopBar";
import { SpatialJourneyDock } from "@/components/navigation/SpatialJourneyDock";
import { DetailPanel } from "@/components/overlay/DetailPanel";
import { ContactPanel } from "@/components/overlay/ContactPanel";
import { LiquidGlassCard } from "@/components/kokonutui/LiquidGlassCard";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { StaticPortfolio } from "@/components/fallback/StaticPortfolio";
import { BentoPortfolio } from "@/components/bento/BentoPortfolio";
import { useCapabilities, shouldRender3D } from "@/lib/mesh/useCapabilities";
import { useIsMobile } from "@/lib/useIsMobile";
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
  const isMobile = useIsMobile();
  const [layer, setLayer] = useState<LayerId>("overview");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [booted, setBooted] = useState(false);
  const [userViewMode, setUserViewMode] = useState<"spatial" | "bento" | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showMobileToast, setShowMobileToast] = useState(false);

  // If user explicitly switched mode, respect their choice; otherwise mobile defaults to "bento"
  const viewMode = userViewMode ?? (isMobile ? "bento" : "spatial");

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

  const switchToSpatial = useCallback(() => {
    setUserViewMode("spatial");
    if (typeof window !== "undefined" && window.innerWidth < 840) {
      setShowMobileToast(true);
      setTimeout(() => setShowMobileToast(false), 5000);
    }
  }, []);

  const toggleViewMode = useCallback(() => {
    const next = viewMode === "spatial" ? "bento" : "spatial";
    setUserViewMode(next);
    if (next === "spatial" && typeof window !== "undefined" && window.innerWidth < 840) {
      setShowMobileToast(true);
      setTimeout(() => setShowMobileToast(false), 5000);
    }
  }, [viewMode]);

  const handleContextLost = useCallback(() => {
    // If WebGL renderer loses context, gracefully auto-fallback to 3D Bento mode
    setUserViewMode("bento");
  }, []);

  const openCommand = useCallback(() => setCommandOpen(true), []);
  const closeCommand = useCallback(() => setCommandOpen(false), []);

  // Global keyboard shortcut for Command Palette: Cmd+K / Ctrl+K
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Arrow keys step through the current layer's nodes in spatial mode
  useEffect(() => {
    if (viewMode !== "spatial") return;

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
  }, [graph, selectedId, viewMode]);

  // Server render and initial client hydration fallback
  if (!capabilities.ready) {
    return <StaticPortfolio />;
  }

  // Non-WebGL environment fallback
  if (!shouldRender3D(capabilities)) {
    return (
      <div data-fallback-reason="no-webgl" data-webgl="false">
        <StaticPortfolio />
      </div>
    );
  }

  // 3D Bento Matrix View Mode
  if (viewMode === "bento") {
    return (
      <div className={styles.bentoWrap}>
        <TopBar
          viewMode={viewMode}
          currentLayer={layer}
          onToggleViewMode={toggleViewMode}
          onOpenCommandPalette={openCommand}
          onOpenContact={() => setIsContactOpen(true)}
        />
        <BentoPortfolio
          onSwitchToSpatial={switchToSpatial}
          onOpenCommandPalette={openCommand}
        />
        <CommandPalette
          isOpen={commandOpen}
          onClose={closeCommand}
          onNavigateLayer={(l) => {
            changeLayer(l);
            setUserViewMode("spatial");
          }}
          onSelectNode={(id) => {
            handleSelect(id);
            setUserViewMode("spatial");
          }}
          onToggleViewMode={toggleViewMode}
          viewMode={viewMode}
        />

        {/* Contact Modal */}
        <AnimatePresence>
          {isContactOpen && (
            <div
              className={styles.contactModalOverlay}
              onClick={() => setIsContactOpen(false)}
            >
              <motion.div
                className={styles.contactModalDialog}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
              >
                <LiquidGlassCard glow="cool" highlightBorder>
                  <div className={styles.contactModalInner}>
                    <div className={styles.contactModalHeader}>
                      <div className={styles.contactHeaderTitle}>
                        <span className={styles.contactDot} />
                        <span>Message Pavan Kalyan Vetla</span>
                      </div>
                      <button
                        className={styles.contactCloseBtn}
                        onClick={() => setIsContactOpen(false)}
                      >
                        ×
                      </button>
                    </div>
                    <ContactPanel showHeader={false} />
                  </div>
                </LiquidGlassCard>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 3D Spatial Universe View Mode (Primary)
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
      <TopBar
        viewMode={viewMode}
        currentLayer={layer}
        onToggleViewMode={toggleViewMode}
        onOpenCommandPalette={openCommand}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <div
        className={styles.canvasHost}
        data-cursor={cursorNode ? "node" : undefined}
        data-cursor-label={cursorNode?.label}
      >
        <MeshCanvas quality={quality} onContextLost={handleContextLost}>
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

      {/* Mobile 3D Experience Toast */}
      <AnimatePresence>
        {showMobileToast && (
          <motion.div
            className={styles.mobileToast}
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            transition={{ duration: 0.25 }}
          >
            <span className={styles.toastIcon}>✦</span>
            <span className={styles.toastText}>
              For the best 3D orbital experience, view on PC or laptop.
            </span>
            <button
              className={styles.toastCloseBtn}
              onClick={() => setShowMobileToast(false)}
              aria-label="Close"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {booted && <LayerIntro graph={graph} dimmed={selectedNode !== null} />}
      <DetailPanel node={selectedNode} onClose={closePanel} />

      {/* Unified Bottom 3D Spatial Journey Dock */}
      <SpatialJourneyDock
        currentLayer={layer}
        onSelectLayer={changeLayer}
        nodes={graph.nodes}
        selectedId={selectedId}
        onSelectNode={setSelectedId}
        onSwitchToBento={() => setUserViewMode("bento")}
      />

      {!booted && <BootSequence onComplete={() => setBooted(true)} />}

      <CommandPalette
        isOpen={commandOpen}
        onClose={closeCommand}
        onNavigateLayer={changeLayer}
        onSelectNode={handleSelect}
        onToggleViewMode={toggleViewMode}
        viewMode={viewMode}
      />

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <div
            className={styles.contactModalOverlay}
            onClick={() => setIsContactOpen(false)}
          >
            <motion.div
              className={styles.contactModalDialog}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
            >
              <LiquidGlassCard glow="cool" highlightBorder>
                <div className={styles.contactModalInner}>
                  <div className={styles.contactModalHeader}>
                    <div className={styles.contactHeaderTitle}>
                      <span className={styles.contactDot} />
                      <span>Message Pavan Kalyan Vetla</span>
                    </div>
                    <button
                      className={styles.contactCloseBtn}
                      onClick={() => setIsContactOpen(false)}
                    >
                      ×
                    </button>
                  </div>
                  <ContactPanel />
                </div>
              </LiquidGlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ExperienceBoundary>
  );
}
