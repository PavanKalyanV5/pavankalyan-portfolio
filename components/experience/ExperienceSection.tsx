import { Container, Typography, Box, List, ListItem } from "@mui/material";
import { NodeGraph, type NodeGraphItem } from "@/components/graph/NodeGraph";
import { experience } from "@/content/experience";

export function ExperienceSection() {
  const items: NodeGraphItem[] = experience.map((entry) => ({
    id: entry.id,
    title: entry.role,
    subtitle: `${entry.organization} · ${entry.location}`,
    dateLabel: entry.dateLabel,
    glyph: "backend",
    isCurrent: entry.tier === "primary" && entry.dateLabel.includes("Present"),
    body: (
      <List dense disablePadding>
        {entry.bullets.map((bullet, index) => (
          <ListItem key={index} disableGutters sx={{ display: "list-item", listStyleType: "disc", ml: 2 }}>
            {bullet}
          </ListItem>
        ))}
      </List>
    ),
  }));

  return (
    <Box component="section" id="experience" sx={{ py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Experience
        </Typography>
        <NodeGraph items={items} />
      </Container>
    </Box>
  );
}
