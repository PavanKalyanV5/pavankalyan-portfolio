import { Container, Typography, Box, Chip, Stack, Link as MuiLink } from "@mui/material";
import { Timeline, type TimelineItemData } from "@/components/timeline/Timeline";
import { GeneratedIcon } from "@/components/icons/GeneratedIcon";
import { projects } from "@/content/projects";

export function ProjectsSection() {
  const items: TimelineItemData[] = [...projects].reverse().map((project) => ({
    id: project.id,
    title: project.name,
    subtitle: project.techStack.join(" · "),
    dateLabel: project.dateLabel,
    tier: project.tier === "featured" ? "primary" : "compact",
    body: (
      <Box>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <GeneratedIcon seed={project.id} glyph={project.glyph} size={40} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              {project.description}
            </Typography>
            {project.concurrentWith && (
              <Chip label={project.concurrentWith} size="small" variant="outlined" sx={{ mb: 1 }} />
            )}
            {project.bullets.length > 0 && (
              <Box component="ul" sx={{ pl: 3, m: 0 }}>
                {project.bullets.map((bullet, index) => (
                  <li key={index}>
                    <Typography variant="body2" color="text.secondary">
                      {bullet}
                    </Typography>
                  </li>
                ))}
              </Box>
            )}
            {project.links.length > 0 && (
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                {project.links.map((link) => (
                  <MuiLink key={link.url} href={link.url} target="_blank" rel="noopener">
                    {link.label}
                  </MuiLink>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </Box>
    ),
  }));

  return (
    <Box component="section" id="projects" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Projects
        </Typography>
        <Timeline items={items} />
      </Container>
    </Box>
  );
}
