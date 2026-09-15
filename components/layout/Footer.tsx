import { Box, Typography, Container } from "@mui/material";

export function Footer() {
  return (
    <Box component="footer" sx={{ py: 4, mt: 8, borderTop: "1px solid", borderColor: "divider" }}>
      <Container maxWidth="md">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Pavan Kalyan Vetla. Built with Next.js, MUI, and React Three Fiber.
        </Typography>
      </Container>
    </Box>
  );
}
