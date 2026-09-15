import { Container, Typography, Box, Stack, Link as MuiLink } from "@mui/material";
import { GeneratedIcon } from "@/components/icons/GeneratedIcon";
import { socials } from "@/content/socials";

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
              <GeneratedIcon seed={social.id} glyph="link" size={40} />
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
