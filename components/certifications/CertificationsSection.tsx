"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Collapse,
  Button,
  Grid2 as Grid,
  Paper,
  Stack,
  Link as MuiLink,
} from "@mui/material";
import { IssuerIcon } from "@/components/icons/IssuerIcon";
import { certifications } from "@/content/certifications";

export function CertificationsSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box component="section" id="certifications" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Certifications
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {certifications.length} certifications across cloud, AI/ML, security, and full-stack development.
        </Typography>
        <Button variant="outlined" onClick={() => setExpanded((prev) => !prev)} sx={{ mb: 2 }}>
          {expanded ? "Hide certifications" : "Show all certifications"}
        </Button>
        <Collapse in={expanded} unmountOnExit>
          <Grid container spacing={2}>
            {certifications.map((cert) => (
              <Grid key={cert.id} size={{ xs: 12, sm: 6 }}>
                <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <IssuerIcon issuer={cert.issuer} size={36} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {cert.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cert.issuer}
                        {cert.dateLabel ? ` · ${cert.dateLabel}` : ""}
                      </Typography>
                      {cert.verificationUrl && (
                        <MuiLink href={cert.verificationUrl} target="_blank" rel="noopener" variant="body2">
                          Verify
                        </MuiLink>
                      )}
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </Container>
    </Box>
  );
}
