import { Container, Typography, Box } from "@mui/material";
import { Timeline, type TimelineItemData } from "@/components/timeline/Timeline";
import { education } from "@/content/education";

export function EducationSection() {
  const items: TimelineItemData[] = education.map((entry) => ({
    id: entry.id,
    title: entry.credential,
    subtitle: entry.institution,
    dateLabel: entry.dateLabel,
    tier: "compact",
    body: (
      <Typography variant="body2" color="text.secondary">
        {entry.grade}
      </Typography>
    ),
  }));

  return (
    <Box component="section" id="education" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Education
        </Typography>
        <Timeline items={items} />
      </Container>
    </Box>
  );
}
