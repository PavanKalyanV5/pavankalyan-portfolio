import { Container, Typography, Box } from "@mui/material";

export function About() {
  return (
    <Box component="section" id="about" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          About
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Software Engineer building AI-powered backend systems in production — from agentic
          RAG pipelines and ML forecasting engines to the distributed .NET architecture they
          run on.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Deep experience with .NET Core, .NET Orleans, and event-driven microservices,
          applying Domain-Driven Design, CQRS, and Event Sourcing to real business-scale
          problems — with full-stack React/TypeScript experience across the same systems.
        </Typography>
      </Container>
    </Box>
  );
}
