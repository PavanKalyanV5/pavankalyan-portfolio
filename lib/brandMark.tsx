/**
 * The site mark: a field of points with one "retrieved" cluster, the same idea as the
 * hero. Drawn with plain divs so Satori (next/og) can render it at any size.
 */
const CHALK = "#E6EAEE";
const INK = "#101A2B";
const SODIUM = "#FF6A2B";

export type Dot = [x: number, y: number, r: number];

export const FIELD: Dot[] = [
  [17, 22, 4], [31, 72, 3.4], [74, 17, 3], [82, 66, 4.4], [50, 87, 3], [20, 48, 2.6], [67, 38, 2.4], [41, 15, 2.6],
  [88, 40, 2.6], [11, 76, 2.4], [60, 70, 2.2], [27, 34, 2.2],
];
export const HITS: Dot[] = [[69, 35, 4.2], [37, 64, 4.2], [58, 60, 3.2]];

export function BrandMark({ size, radius = 0.22, withBg = true }: { size: number; radius?: number; withBg?: boolean }) {
  const u = size / 100;
  const dot = ([x, y, r]: Dot, color: string, key: string, opacity = 1) => (
    <div
      key={key}
      style={{
        position: "absolute",
        left: (x - r) * u,
        top: (y - r) * u,
        width: r * 2 * u,
        height: r * 2 * u,
        borderRadius: "50%",
        background: color,
        opacity,
      }}
    />
  );
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: size,
        height: size,
        background: withBg ? INK : "transparent",
        borderRadius: size * radius,
        overflow: "hidden",
      }}
    >
      {FIELD.map((d, i) => dot(d, CHALK, `f${i}`, 0.7))}
      {/* the query: ring + core */}
      <div
        style={{
          position: "absolute",
          left: (52 - 23) * u,
          top: (50 - 23) * u,
          width: 46 * u,
          height: 46 * u,
          borderRadius: "50%",
          border: `${Math.max(2, 3.2 * u)}px solid ${SODIUM}`,
          opacity: 0.9,
        }}
      />
      {dot([52, 50, 11], SODIUM, "core")}
      {HITS.map((d, i) => dot(d, SODIUM, `h${i}`))}
    </div>
  );
}

export const BRAND = { CHALK, INK, SODIUM };
