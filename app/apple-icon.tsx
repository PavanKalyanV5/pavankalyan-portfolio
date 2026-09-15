import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#05070E",
          padding: "24px 0",
        }}
      >
        {/* Node motif - positioned in upper portion */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: "120px",
            height: "120px",
            marginTop: "12px",
          }}
        >
          {/* Cool ring (outer border circle) */}
          <div
            style={{
              position: "absolute",
              width: "87px",
              height: "87px",
              borderRadius: "50%",
              border: "5px solid #5EE7D6",
              backgroundColor: "transparent",
            }}
          />

          {/* Warm center dot */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#FFB35C",
            }}
          />
        </div>

        {/* Monogram text */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            color: "#E8ECF5",
            letterSpacing: "6px",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          PKV
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
