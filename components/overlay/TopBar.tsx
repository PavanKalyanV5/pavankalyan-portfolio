"use client";

import React, { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StatusPill } from "@/components/ui/StatusPill";
import { isSoundEnabled, toggleSound } from "@/lib/audio/soundFx";
import { LAYER_GRAPHS } from "@/lib/mesh/layers";
import type { LayerId } from "@/lib/mesh/types";
import { OPEN_TO_WORK, OPEN_TO_WORK_LABEL } from "@/lib/config";
import styles from "./TopBar.module.css";

export interface TopBarProps {
  viewMode?: "spatial" | "bento";
  currentLayer?: LayerId;
  onToggleViewMode?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenContact?: () => void;
}

export function TopBar({
  viewMode = "spatial",
  currentLayer,
  onToggleViewMode,
  onOpenCommandPalette,
  onOpenContact,
}: TopBarProps) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleSoundToggle = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  const currentLayerName = currentLayer
    ? LAYER_GRAPHS[currentLayer]?.label
    : null;

  return (
    <GlassPanel as="header" className={styles.topBar}>
      {/* Left Cluster: Profile Avatar and Title */}
      <div className={styles.leftCluster}>
        <div className={styles.profileAvatarWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/profile.jpg"
            alt="Pavan Kalyan Vetla"
            width={36}
            height={36}
            className={styles.profileAvatarImg}
            loading="eager"
          />
          <span className={styles.onlineBeacon} />
        </div>
        <div className={styles.nameBlock}>
          <span className={styles.fullName}>Pavan Kalyan Vetla</span>
          <span className={styles.roleSub}>AI & .NET Software Engineer</span>
        </div>

        {/* Active Sector Breadcrumb in 3D Mode */}
        {viewMode === "spatial" && currentLayerName && (
          <div className={styles.sectorBadge}>
            <span className={styles.sectorDot} />
            <span className={styles.sectorText}>{currentLayerName.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Middle Cluster: Command Palette Search */}
      <div className={styles.middleCluster}>
        {onOpenCommandPalette && (
          <button
            className={styles.searchTrigger}
            onClick={onOpenCommandPalette}
            aria-label="Open Command Palette (Cmd+K)"
            data-cursor="link"
          >
            <span className={styles.searchIcon}>⌕</span>
            <span className={styles.searchText}>Search anything...</span>
            <kbd className={styles.kbd}>⌘K</kbd>
          </button>
        )}
      </div>

      {/* Right Cluster: Controls & Status */}
      <div className={styles.rightCluster}>
        {/* Audio Toggle */}
        <button
          className={`${styles.iconButton} ${soundOn ? styles.activeAudio : ""}`}
          onClick={handleSoundToggle}
          title={soundOn ? "Mute 3D Audio" : "Enable 3D Audio"}
          aria-label={soundOn ? "Mute 3D Audio" : "Enable 3D Audio"}
          data-cursor="link"
        >
          {soundOn ? "🔊" : "🔇"}
        </button>

        {/* View Mode Switcher */}
        {onToggleViewMode && (
          <button
            className={styles.viewModeButton}
            onClick={onToggleViewMode}
            data-cursor="link"
            title={
              viewMode === "spatial"
                ? "Switch to 3D Bento Matrix"
                : "Switch to 3D Spatial Universe"
            }
          >
            <span className={styles.viewModeDot} />
            <span className={styles.viewModeText}>
              {viewMode === "spatial" ? "3D SPATIAL" : "3D BENTO"}
            </span>
          </button>
        )}

        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.resumeLink}
          data-cursor="link"
        >
          Resume
        </a>

        {onOpenContact && (
          <button
            className={styles.contactBtn}
            onClick={onOpenContact}
            data-cursor="link"
          >
            Message
          </button>
        )}

        {OPEN_TO_WORK && (
          <div className={styles.statusPillWrap}>
            <StatusPill label={OPEN_TO_WORK_LABEL} tone="live" />
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
