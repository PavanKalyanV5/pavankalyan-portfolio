import type { ReactNode } from "react";
import { Container, Typography, Box, Stack, Link as MuiLink } from "@mui/material";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { SiLeetcode, SiGeeksforgeeks, SiGooglecloud } from "react-icons/si";
import { GeneratedIcon } from "@/components/icons/GeneratedIcon";
import { socials } from "@/content/socials";

const BRAND_ICON_SIZE = 40;
const BRAND_ICON_COLOR: Record<string, string> = {
  github: "#e6edf3",
  linkedin: "#0A66C2",
  leetcode: "#FFA116",
  geeksforgeeks: "#2F8D46",
  twitter: "#e6edf3",
  "google-cloud-skills": "#4285F4",
};

const BRAND_ICONS: Record<string, ReactNode> = {
  github: <FaGithub size={BRAND_ICON_SIZE} color={BRAND_ICON_COLOR.github} />,
  linkedin: <FaLinkedin size={BRAND_ICON_SIZE} color={BRAND_ICON_COLOR.linkedin} />,
  leetcode: <SiLeetcode size={BRAND_ICON_SIZE} color={BRAND_ICON_COLOR.leetcode} />,
  geeksforgeeks: (
    <SiGeeksforgeeks size={BRAND_ICON_SIZE} color={BRAND_ICON_COLOR.geeksforgeeks} />
  ),
  twitter: <FaXTwitter size={BRAND_ICON_SIZE} color={BRAND_ICON_COLOR.twitter} />,
  "google-cloud-skills": (
    <SiGooglecloud size={BRAND_ICON_SIZE} color={BRAND_ICON_COLOR["google-cloud-skills"]} />
  ),
};

export function SocialsSection() {
  return (
    <Box component="section" id="socials" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Socials & Competitive Profiles
        </Typography>
        <Stack direction="row" flexWrap="wrap" useFlexGap gap={3}>
          {socials.map((social) => (
            <MuiLink
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener"
              underline="none"
              sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, width: 96 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 48 }}>
                {BRAND_ICONS[social.id] ?? <GeneratedIcon seed={social.id} glyph="link" size={40} />}
              </Box>
              <Typography variant="caption" align="center">
                {social.label}
              </Typography>
            </MuiLink>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
