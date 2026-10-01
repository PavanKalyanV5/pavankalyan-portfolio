import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { BrandMark, BRAND } from "@/lib/brandMark";
import { profile } from "@/content/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name}: software engineer building AI-powered backend systems`;

export default async function OGImage() {
  // The site's own typeface, so the preview card matches the page.
  const dir = path.join(process.cwd(), "assets", "fonts");
  const [heavy, medium] = await Promise.all([
    readFile(path.join(dir, "BricolageGrotesque-ExtraBold.ttf")),
    readFile(path.join(dir, "BricolageGrotesque-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: BRAND.INK,
          color: BRAND.CHALK,
          fontFamily: "Bricolage",
          fontWeight: 500,
          padding: "64px 72px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#9AA6B8" }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: BRAND.SODIUM, display: "flex" }} />
            Open to full-stack, backend and AI engineering roles
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1, letterSpacing: -3, display: "flex", flexWrap: "wrap" }}>
              {profile.name}
            </div>
            <div style={{ fontSize: 34, lineHeight: 1.3, color: "#B9C4D4", marginTop: 28, display: "flex" }}>
              Software engineer building AI-powered backend systems: agentic RAG, ML forecasting, and event-driven .NET at scale.
            </div>
          </div>

          <div style={{ display: "flex", gap: 28, fontSize: 24, color: "#9AA6B8" }}>
            <span>.NET 8</span>
            <span>Python</span>
            <span>Semantic Kernel</span>
            <span>Orleans</span>
          </div>
        </div>

        <div style={{ display: "flex", position: "absolute", right: 56, top: 115 }}>
          <BrandMark size={400} radius={0.1} withBg={false} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: medium, weight: 500, style: "normal" },
        { name: "Bricolage", data: heavy, weight: 800, style: "normal" },
      ],
    },
  );
}
