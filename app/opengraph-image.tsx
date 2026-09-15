import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Pavan Kalyan Vetla — Software Engineer";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#05070E",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative node graph - right side background */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "400px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.15,
          }}
        >
          {/* Large circle - top right */}
          <div
            style={{
              position: "absolute",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: "2px solid #5EE7D6",
              top: "60px",
              right: "80px",
            }}
          />
          {/* Medium circle - middle right */}
          <div
            style={{
              position: "absolute",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "2px solid #5EE7D6",
              top: "240px",
              right: "120px",
            }}
          />
          {/* Small circle - bottom right */}
          <div
            style={{
              position: "absolute",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "2px solid #5EE7D6",
              bottom: "80px",
              right: "200px",
            }}
          />
          {/* Tiny circle - bottom far right */}
          <div
            style={{
              position: "absolute",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "2px solid #5EE7D6",
              bottom: "120px",
              right: "60px",
            }}
          />
        </div>

        {/* Main content - left aligned */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "60%",
            height: "100%",
            padding: "80px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Top section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Name */}
            <div
              style={{
                fontSize: "84px",
                fontWeight: "bold",
                color: "#E8ECF5",
                lineHeight: 1,
                letterSpacing: "-2px",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Pavan Kalyan Vetla
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: "32px",
                color: "#8B98B5",
                lineHeight: 1.4,
                maxWidth: "500px",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Software Engineer — AI-Powered Backend Systems & .NET Full-Stack Developer
            </div>
          </div>

          {/* Bottom section - status indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#FFB35C",
              }}
            />
            <div
              style={{
                fontSize: "24px",
                color: "#FFB35C",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              open to work
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
