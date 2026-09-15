"use client";

import { AppBar, Toolbar, Typography, IconButton, Box, Chip } from "@mui/material";
import { useColorMode } from "@/theme/ThemeRegistry";

export function Header() {
  const { mode, toggleMode } = useColorMode();

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: "blur(8px)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
        <Typography variant="h6" component="span" fontWeight={700} sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
          Pavan Kalyan Vetla
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip label="Open to opportunities" color="primary" variant="outlined" size="small" sx={{ display: { xs: "none", sm: "inline-flex" } }} />
          <IconButton aria-label="toggle color mode" onClick={toggleMode}>
            {mode === "dark" ? "🌙" : "☀️"}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
