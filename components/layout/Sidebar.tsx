"use client";

import { Box, Stack, Typography, IconButton, Chip, Tooltip } from "@mui/material";
import { GeneratedIcon } from "@/components/icons/GeneratedIcon";
import { useColorMode } from "@/theme/ThemeRegistry";
import type { PanelConfig, PanelId } from "./panels";

export const SIDEBAR_WIDTH = 96;
export const BOTTOM_NAV_HEIGHT = 72;

interface SidebarProps {
  panels: PanelConfig[];
  activePanel: PanelId;
  onSelect: (id: PanelId) => void;
}

export function Sidebar({ panels, activePanel, onSelect }: SidebarProps) {
  const { mode, toggleMode } = useColorMode();

  return (
    <>
      {/* Desktop: fixed vertical sidebar */}
      <Box
        component="nav"
        aria-label="Section navigation"
        sx={{
          display: { xs: "none", sm: "flex" },
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          py: 3,
          borderRight: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(10px)",
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Stack spacing={0.5} alignItems="center">
          <Typography variant="caption" fontWeight={700} sx={{ writingMode: "vertical-rl", mb: 2 }}>
            PKV
          </Typography>
        </Stack>

        <Stack spacing={2} alignItems="center">
          {panels.map((panel) => {
            const isActive = panel.id === activePanel;
            return (
              <Tooltip key={panel.id} title={panel.label} placement="right">
                <Box
                  role="button"
                  aria-label={panel.label}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onSelect(panel.id)}
                  sx={{
                    cursor: "pointer",
                    p: 0.5,
                    borderRadius: "50%",
                    outline: isActive ? "2px solid" : "2px solid transparent",
                    outlineColor: isActive ? "primary.main" : "transparent",
                    transition: "outline-color 0.2s ease, transform 0.2s ease",
                    "&:hover": { transform: "scale(1.08)" },
                  }}
                >
                  <GeneratedIcon seed={panel.id} glyph={panel.glyph} size={40} />
                </Box>
              </Tooltip>
            );
          })}
        </Stack>

        <Stack spacing={1.5} alignItems="center">
          <Chip
            label="Open"
            color="primary"
            variant="outlined"
            size="small"
            sx={{ fontSize: "0.65rem" }}
          />
          <IconButton aria-label="toggle color mode" onClick={toggleMode} size="small">
            {mode === "dark" ? "🌙" : "☀️"}
          </IconButton>
        </Stack>
      </Box>

      {/* Mobile: fixed bottom nav */}
      <Box
        component="nav"
        aria-label="Section navigation"
        sx={{
          display: { xs: "flex", sm: "none" },
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: BOTTOM_NAV_HEIGHT,
          alignItems: "center",
          justifyContent: "space-around",
          borderTop: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(10px)",
          zIndex: (theme) => theme.zIndex.appBar,
          overflowX: "auto",
          px: 1,
        }}
      >
        {panels.map((panel) => {
          const isActive = panel.id === activePanel;
          return (
            <Box
              key={panel.id}
              role="button"
              aria-label={panel.label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onSelect(panel.id)}
              sx={{
                cursor: "pointer",
                p: 0.5,
                borderRadius: "50%",
                outline: isActive ? "2px solid" : "2px solid transparent",
                outlineColor: isActive ? "primary.main" : "transparent",
                flexShrink: 0,
              }}
            >
              <GeneratedIcon seed={panel.id} glyph={panel.glyph} size={32} />
            </Box>
          );
        })}
        <IconButton aria-label="toggle color mode" onClick={toggleMode} size="small">
          {mode === "dark" ? "🌙" : "☀️"}
        </IconButton>
      </Box>
    </>
  );
}
