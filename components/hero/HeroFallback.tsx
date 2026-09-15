import { Box } from "@mui/material";

export function HeroFallback() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at 30% 30%, #8A5CFF33, transparent 60%), radial-gradient(circle at 70% 70%, #4F9DFF33, transparent 60%)",
      }}
      aria-hidden
    />
  );
}
