import { ScrollScrubber } from "./ScrollScrubber";
import { SoundToggle } from "./SoundToggle";
import styles from "./PageDock.module.css";

/** Bottom controls: sound switch and the checkpoint ruler, sitting beside the theme switcher. */
export function PageDock() {
  return (
    <div className={styles.dock}>
      <SoundToggle />
      <ScrollScrubber />
    </div>
  );
}
