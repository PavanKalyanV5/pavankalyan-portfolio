import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#05070E",
          position: "relative",
        }}
      >
        {/* Cool ring (outer border circle) */}
        <div
          style={{
            position: "absolute",
            width: "46px",
            height: "46px",
            borderRadius: "50%",
            border: "4px solid #5EE7D6",
            backgroundColor: "transparent",
          }}
        />

        {/* Warm center dot */}
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            backgroundColor: "#FFB35C",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
