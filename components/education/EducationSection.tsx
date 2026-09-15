import { Container, Typography, Box } from "@mui/material";
import { NodeGraph, type NodeGraphItem } from "@/components/graph/NodeGraph";
import { education } from "@/content/education";

export function EducationSection() {
  const items: NodeGraphItem[] = education.map((entry) => ({
    id: entry.id,
    title: entry.credential,
    subtitle: entry.institution,
    dateLabel: entry.dateLabel,
    glyph: "pattern",
    body: (
      <Typography variant="body2" color="text.secondary">
        {entry.grade}
      </Typography>
    ),
  }));

  return (
    <Box component="section" id="education" sx={{ py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Education
        </Typography>
        <NodeGraph items={items} />
      </Container>
    </Box>
  );
}
