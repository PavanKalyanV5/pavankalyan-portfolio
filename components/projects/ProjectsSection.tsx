import { Container, Typography, Box, Chip, Stack, Link as MuiLink } from "@mui/material";
import { NodeGraph, type NodeGraphItem } from "@/components/graph/NodeGraph";
import { projects } from "@/content/projects";

export function ProjectsSection() {
  const items: NodeGraphItem[] = projects.map((project) => ({
    id: project.id,
    title: project.name,
    subtitle: project.techStack.join(" · "),
    dateLabel: project.dateLabel,
    glyph: project.glyph,
    body: (
      <Box>
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
    ),
  }));

  return (
    <Box component="section" id="projects" sx={{ py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Projects
        </Typography>
        <NodeGraph items={items} />
      </Container>
    </Box>
  );
}
