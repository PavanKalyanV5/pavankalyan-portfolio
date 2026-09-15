"use client";

import { useState, type ReactNode } from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { GeneratedIcon } from "@/components/icons/GeneratedIcon";
import type { IconGlyph } from "@/content/types";

export interface NodeGraphItem {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  glyph: IconGlyph;
  body: ReactNode;
  isCurrent?: boolean;
}

interface NodeGraphProps {
  items: NodeGraphItem[];
}

export function NodeGraph({ items }: NodeGraphProps) {
  const explicitCurrent = items.findIndex((item) => item.isCurrent);
  const defaultIndex = explicitCurrent >= 0 ? explicitCurrent : items.length - 1;
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const selected = items[selectedIndex];

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: { xs: 3, sm: 5 },
          overflowX: "auto",
          overflowY: "hidden",
          py: 4,
          px: 1,
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, rgba(79,157,255,0.5), rgba(138,92,255,0.5), transparent)",
            zIndex: 0,
          },
        }}
      >
        {items.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <Box
              key={item.id}
              onClick={() => setSelectedIndex(index)}
              onMouseEnter={() => setSelectedIndex(index)}
              role="button"
              aria-pressed={isSelected}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") setSelectedIndex(index);
              }}
              sx={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                flexShrink: 0,
                cursor: "pointer",
                minWidth: 88,
              }}
            >
              <motion.div
                animate={{
                  scale: isSelected ? 1.25 : 1,
                  boxShadow: isSelected
                    ? "0 0 24px 4px rgba(79,157,255,0.55)"
                    : "0 0 0px 0px rgba(79,157,255,0)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ borderRadius: "50%" }}
              >
                <GeneratedIcon seed={item.id} glyph={item.glyph} size={isSelected ? 56 : 44} />
              </motion.div>
              <Typography
                variant="caption"
                align="center"
                sx={{
                  color: isSelected ? "primary.main" : "text.secondary",
                  fontWeight: isSelected ? 700 : 400,
                  maxWidth: 100,
                  lineHeight: 1.2,
                }}
              >
                {item.dateLabel}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <motion.div
        key={selected.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, sm: 4 },
            mt: 2,
            borderColor: "primary.main",
            background:
              "linear-gradient(135deg, rgba(79,157,255,0.06), rgba(138,92,255,0.04))",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {selected.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selected.subtitle}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" whiteSpace="nowrap">
              {selected.dateLabel}
            </Typography>
          </Stack>
          <Box sx={{ mt: 2 }}>{selected.body}</Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
