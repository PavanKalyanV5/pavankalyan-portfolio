import type { ReactNode } from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";

export interface TimelineItemData {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  tier: "primary" | "compact";
  body: ReactNode;
}

export function Timeline({ items }: { items: TimelineItemData[] }) {
  return (
    <Stack spacing={3}>
      {items.map((item) => (
        <Paper
          key={item.id}
          variant="outlined"
          sx={{
            p: item.tier === "primary" ? 4 : 2.5,
            borderColor: item.tier === "primary" ? "primary.main" : "divider",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
            <Box>
              <Typography variant={item.tier === "primary" ? "h6" : "subtitle1"} fontWeight={700}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.subtitle}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" whiteSpace="nowrap">
              {item.dateLabel}
            </Typography>
          </Stack>
          <Box sx={{ mt: 2 }}>{item.body}</Box>
        </Paper>
      ))}
    </Stack>
  );
}
