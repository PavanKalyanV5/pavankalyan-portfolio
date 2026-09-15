"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { Sidebar, SIDEBAR_WIDTH, BOTTOM_NAV_HEIGHT } from "./Sidebar";
import { PANELS, DEFAULT_PANEL, isPanelId, type PanelId } from "./panels";

interface AppShellProps {
  panels: Record<PanelId, ReactNode>;
}

export function AppShell({ panels: panelContent }: AppShellProps) {
  const [activePanel, setActivePanel] = useState<PanelId>(DEFAULT_PANEL);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && isPanelId(hash)) setActivePanel(hash);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const handleSelect = (id: PanelId) => {
    setActivePanel(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <Sidebar panels={PANELS} activePanel={activePanel} onSelect={handleSelect} />
      <Box
        component="main"
        sx={{
          flex: 1,
          ml: { xs: 0, sm: `${SIDEBAR_WIDTH}px` },
          pb: { xs: `${BOTTOM_NAV_HEIGHT}px`, sm: 0 },
          height: "100dvh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <motion.div
          key={activePanel}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ minHeight: "100%" }}
        >
          {panelContent[activePanel]}
        </motion.div>
      </Box>
    </Box>
  );
}
