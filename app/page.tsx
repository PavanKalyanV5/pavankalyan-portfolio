import { SceneLayer } from "@/components/scene/SceneLayer";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { DepthStage } from "@/components/site/DepthStage";
import { CursorReticle } from "@/components/ui/CursorReticle";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Recruiters } from "@/components/site/Recruiters";
import { MarqueeBand } from "@/components/site/MarqueeBand";
import { Work } from "@/components/site/Work";
import { Projects } from "@/components/site/Projects";
import { Skills } from "@/components/site/Skills";
import { Credentials } from "@/components/site/Credentials";
import { Contact } from "@/components/site/Contact";

export default function HomePage() {
  return (
    <>
      <SceneLayer />
      <SmoothScroll />
      <DepthStage />
      <CursorReticle />
      <Nav />
      <main id="main">
        <Hero />
        <Recruiters />
        <MarqueeBand words={["Retrieve", "Forecast", "Act"]} />
        <Work />
        <MarqueeBand words={["Agentic RAG", "ML forecasting", "Event sourcing"]} dir={-1} />
        <Projects />
        <MarqueeBand words={["Open source", "Local first", "Zero dependencies"]} />
        <Skills />
        <Credentials />
        <Contact />
      </main>
    </>
  );
}
