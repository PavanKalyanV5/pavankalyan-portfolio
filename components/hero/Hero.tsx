"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Container, Typography, Chip, Button, Stack } from "@mui/material";
import { HeroErrorBoundary } from "./HeroErrorBoundary";
import { HeroFallback } from "./HeroFallback";
import { socials } from "@/content/socials";

const HeroScene = dynamic(() => import("./HeroScene").then((mod) => mod.HeroScene), {
  ssr: false,
  loading: () => <HeroFallback />,
});

export function Hero() {
  const github = socials.find((s) => s.id === "github");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <Box component="section" sx={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
      <HeroErrorBoundary>{prefersReducedMotion ? <HeroFallback /> : <HeroScene />}</HeroErrorBoundary>
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Chip label="Open to opportunities" color="primary" sx={{ mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom fontWeight={800}>
          Pavan Kalyan Vetla
        </Typography>
        <Typography variant="h5" component="p" color="text.secondary" gutterBottom>
          Software Engineer — AI-Powered Backend Systems & .NET Full-Stack Developer
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 4 }} flexWrap="wrap" useFlexGap>
          <Button variant="contained" size="large" href="/resume.pdf" target="_blank" rel="noopener">
            Resume
          </Button>
          <Button variant="outlined" size="large" href="#connect">
            Contact
          </Button>
          {github && (
            <Button variant="text" size="large" href={github.url} target="_blank" rel="noopener">
              GitHub
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
