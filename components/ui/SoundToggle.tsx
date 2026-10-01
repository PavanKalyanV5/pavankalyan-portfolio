"use client";

import { useEffect, useSyncExternalStore } from "react";
import { PiSpeakerHighBold, PiSpeakerSlashBold } from "react-icons/pi";
import { sfx } from "@/lib/sfx";
import styles from "./SoundToggle.module.css";

const CLICKABLE = 'a[href], button, summary, [role="tab"], [role="radio"]';

/** Opt-in switch for the interface sounds. Off until the visitor chooses, and it says so until they do. */
export function SoundToggle() {
  const on = useSyncExternalStore(sfx.subscribe, sfx.getSnapshot, sfx.getServerSnapshot);
  // Until a choice is made the toggle invites one; on the server it is treated as already chosen.
  const chosen = useSyncExternalStore(sfx.subscribe, sfx.hasChosen, () => true);

  useEffect(() => {
    sfx.restore();

    // Hover and press sounds for anything clickable. Checkpoints make their own sound.
    let last: Element | null = null;
    const over = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const el = (e.target as Element | null)?.closest?.(CLICKABLE) ?? null;
      if (el && el !== last && !el.hasAttribute("data-checkpoint")) sfx.hover();
      last = el;
    };
    const down = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(CLICKABLE);
      if (el && !el.hasAttribute("data-checkpoint")) sfx.click();
    };
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    return () => {
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
    };
  }, []);

  return (
    <button
      type="button"
      className={`${styles.toggle} ${chosen ? "" : styles.invite}`}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      title={on ? "Sound on" : "Sound off. Turn it on for a sound at every step."}
      onClick={() => void sfx.set(!on)}
    >
      {on ? <PiSpeakerHighBold size={20} /> : <PiSpeakerSlashBold size={20} />}
      {!chosen && <span className={styles.label}>Sound</span>}
    </button>
  );
}
