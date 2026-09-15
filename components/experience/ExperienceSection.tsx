import { Container, Typography, Box, List, ListItem } from "@mui/material";
import { Timeline, type TimelineItemData } from "@/components/timeline/Timeline";
import { experience } from "@/content/experience";

export function ExperienceSection() {
  const items: TimelineItemData[] = experience.map((entry) => ({
    id: entry.id,
    title: entry.role,
    subtitle: `${entry.organization} · ${entry.location}`,
    dateLabel: entry.dateLabel,
    tier: entry.tier,
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
    <Box component="section" id="experience" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Experience
        </Typography>
        <Timeline items={items} />
      </Container>
    </Box>
  );
}
