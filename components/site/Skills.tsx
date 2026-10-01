import { skillCategories } from "@/content/skills";
import { SplitHeading } from "./SplitHeading";
import layout from "./layout.module.css";
import { SkillsExplorer } from "./SkillsExplorer";

export function Skills() {
  return (
    <section id="skills" className={layout.section} data-scene="4" aria-labelledby="skills-h">
      <div className={layout.column}>
        <SplitHeading id="skills-h" className={layout.heading}>
          What I work with
        </SplitHeading>
        <p className={layout.lede} data-depth>
          Backend and AI first, with enough frontend to ship a whole feature. Spin the globe, or pick a row to light up its group.
        </p>
        <div data-depth>
          <SkillsExplorer categories={skillCategories} />
        </div>
      </div>
    </section>
  );
}
