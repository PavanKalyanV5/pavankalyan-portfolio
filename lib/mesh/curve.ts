export type Vec3 = [number, number, number];

/**
 * Control point for an edge's quadratic curve: the midpoint pushed away from
 * the origin to create a gentle outward bow. This ensures overlapping edges
 * in a dense graph remain visually distinct.
 *
 * If the midpoint is within 0.001 of the origin, offset along +Y instead,
 * ensuring a curve even for hub-to-node edges passing through the centre.
 */
export function edgeControlPoint(from: Vec3, to: Vec3): Vec3 {
  // Compute midpoint
  const mid = [
    (from[0] + to[0]) * 0.5,
    (from[1] + to[1]) * 0.5,
    (from[2] + to[2]) * 0.5,
  ] as Vec3;

  // Compute edge length
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Magnitude of the midpoint
  const mag = Math.sqrt(mid[0] * mid[0] + mid[1] * mid[1] + mid[2] * mid[2]);

  const offset = length * 0.14;

  // If midpoint is near the origin, push along +Y
  if (mag < 0.001) {
    return [mid[0], mid[1] + offset, mid[2]];
  }

  // Otherwise, push the midpoint outward along its own direction from origin
  const scale = 1 + offset / mag;
  return [mid[0] * scale, mid[1] * scale, mid[2] * scale];
}

/**
 * Quadratic Bezier curve sample at t in [0,1].
 * Evaluates: (1-t)²·from + 2(1-t)t·control + t²·to
 */
export function pointOnEdge(
  from: Vec3,
  control: Vec3,
  to: Vec3,
  t: number
): Vec3 {
  const oneMinusT = 1 - t;
  const coeff1 = oneMinusT * oneMinusT;
  const coeff2 = 2 * oneMinusT * t;
  const coeff3 = t * t;

  return [
    coeff1 * from[0] + coeff2 * control[0] + coeff3 * to[0],
    coeff1 * from[1] + coeff2 * control[1] + coeff3 * to[1],
    coeff1 * from[2] + coeff2 * control[2] + coeff3 * to[2],
  ];
}
