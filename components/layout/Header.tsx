"use client";

import { AppBar, Toolbar, Typography, IconButton, Box, Chip } from "@mui/material";
import { useColorMode } from "@/theme/ThemeRegistry";

export function Header() {
  const { mode, toggleMode } = useColorMode();

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: "blur(8px)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="span" fontWeight={700}>
          Pavan Kalyan Vetla
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip label="Open to opportunities" color="primary" variant="outlined" size="small" />
          <IconButton aria-label="toggle color mode" onClick={toggleMode}>
            {mode === "dark" ? "🌙" : "☀️"}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
