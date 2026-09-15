import { Container, Typography, Box, Chip, Stack, Paper } from "@mui/material";
import { GeneratedIcon } from "@/components/icons/GeneratedIcon";
import { skillCategories } from "@/content/skills";

export function SkillsSection() {
  return (
    <Box component="section" id="skills" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
          Skills
        </Typography>
        <Stack spacing={3}>
          {skillCategories.map((category) => (
            <Paper key={category.key} variant="outlined" sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <GeneratedIcon seed={category.key} glyph={category.glyph} size={32} />
                <Typography variant="h6" fontWeight={700}>
                  {category.label}
                </Typography>
              </Stack>
              <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
                {category.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    variant="outlined"
                    sx={{ transition: "transform 0.15s ease", "&:hover": { transform: "translateY(-2px)" } }}
                  />
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
