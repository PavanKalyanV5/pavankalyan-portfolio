/**
 * Deploy-time site configuration. These are read from NEXT_PUBLIC_* variables so
 * they can be changed in the hosting dashboard without a code change.
 */

/**
 * Whether to advertise availability in the header.
 * Set NEXT_PUBLIC_OPEN_TO_WORK to "false" to hide the badge. Any other value
 * (including the variable being absent) leaves it visible, so the badge is the
 * default and cannot silently disappear due to a missing variable.
 */
export const OPEN_TO_WORK: boolean =
  process.env.NEXT_PUBLIC_OPEN_TO_WORK !== "false";

/** Text shown in the availability badge. */
export const OPEN_TO_WORK_LABEL: string =
  process.env.NEXT_PUBLIC_OPEN_TO_WORK_LABEL?.trim() || "open to work";
