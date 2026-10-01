import type { IconType } from "react-icons";
import {
  SiDotnet, SiPython, SiReact, SiRedux, SiMui, SiDocker, SiRabbitmq, SiRust, SiTypescript, SiGraphql, SiNeo4J,
  SiFastapi, SiFlask, SiMongodb, SiMysql, SiGithub, SiPostman, SiSwagger, SiJavascript, SiCplusplus, SiTensorflow,
  SiScikitlearn, SiHtml5, SiSqlite, SiOpenjdk, SiAnthropic, SiNodedotjs, SiGooglegemini,
} from "react-icons/si";
import { VscAzure, VscAzureDevops, VscVscode, VscRepo } from "react-icons/vsc";
import { DiMsqlServer, DiVisualstudio, DiCss3 } from "react-icons/di";
import { TbBrandCSharp } from "react-icons/tb";
import {
  LuBrainCircuit, LuWaypoints, LuTrees, LuChartLine, LuSparkles, LuPlug, LuLibrary, LuWorkflow, LuGitBranch, LuLayers,
  LuBlocks, LuNetwork, LuServer, LuBoxes, LuLayoutPanelLeft, LuFactory, LuCircleDot, LuInfinity, LuDatabase, LuBinary,
  LuMerge, LuSwords, LuBrain, LuBraces, LuDoorOpen, LuTerminal, LuTextCursorInput, LuPawPrint,
  LuShieldCheck, LuPackageX, LuAudioLines, LuPuzzle, LuZap,
} from "react-icons/lu";
import styles from "./TechIcon.module.css";

/** First matching pattern wins, so specific names sit above broad ones. */
const RULES: [RegExp, IconType][] = [
  [/node\.?js/i, SiNodedotjs],
  [/gemini/i, SiGooglegemini],
  [/^anthropic$/i, SiAnthropic],
  [/proxy|redaction|regex/i, LuShieldCheck],
  [/zero dependencies/i, LuPackageX],
  [/wasapi|audio/i, LuAudioLines],
  [/chrome extension/i, LuPuzzle],
  [/vite/i, LuZap],
  [/fts5/i, SiSqlite],
  [/semantic kernel/i, LuBrainCircuit],
  [/retrieval|rag\b/i, LuLibrary],
  [/vector|chroma/i, LuWaypoints],
  [/llm|gemini|gpt|claude|litellm/i, LuSparkles],
  [/mcp/i, LuPlug],
  [/lightgbm/i, LuTrees],
  [/time-series|ssa/i, LuChartLine],
  [/bi-lstm|lstm|minimax/i, LuBrain],
  [/tensorflow/i, SiTensorflow],
  [/scikit/i, SiScikitlearn],
  [/c#/i, TbBrandCSharp],
  [/c\+\+/i, SiCplusplus],
  [/\.net|dotnet|webapi|asp/i, SiDotnet],
  [/orleans/i, LuNetwork],
  [/fastapi/i, SiFastapi],
  [/flask/i, SiFlask],
  [/python/i, SiPython],
  [/typescript/i, SiTypescript],
  [/javascript/i, SiJavascript],
  [/java\b/i, SiOpenjdk],
  [/\bsql server|sql developer|management studio/i, DiMsqlServer],
  [/^sql$/i, LuDatabase],
  [/mysql/i, SiMysql],
  [/mongo/i, SiMongodb],
  [/cosmos/i, VscAzure],
  [/neo4j/i, SiNeo4J],
  [/sqlite/i, SiSqlite],
  [/indexeddb/i, LuDatabase],
  [/azure devops|azure repos/i, VscAzureDevops],
  [/azure/i, VscAzure],
  [/docker/i, SiDocker],
  [/rabbitmq/i, SiRabbitmq],
  [/graphql/i, SiGraphql],
  [/rust/i, SiRust],
  [/react/i, SiReact],
  [/redux/i, SiRedux],
  [/material ui|mui/i, SiMui],
  [/formik/i, LuTextCursorInput],
  [/zustand/i, LuPawPrint],
  [/html/i, SiHtml5],
  [/css/i, DiCss3],
  [/visual studio$/i, DiVisualstudio],
  [/vs code/i, VscVscode],
  [/github/i, SiGithub],
  [/postman/i, SiPostman],
  [/swagger/i, SiSwagger],
  [/ci\/cd/i, LuInfinity],
  [/cqrs|event sourcing|projection/i, LuWorkflow],
  [/ddd|domain/i, LuBlocks],
  [/api gateway|gateway/i, LuDoorOpen],
  [/mvc/i, LuLayoutPanelLeft],
  [/factory/i, LuFactory],
  [/singleton/i, LuCircleDot],
  [/object-oriented/i, LuBoxes],
  [/ast|parsing/i, LuBraces],
  [/crdt|yjs|hocuspocus/i, LuMerge],
  [/git/i, LuGitBranch],
  [/api|server/i, LuServer],
  [/azure repos|repo/i, VscRepo],
  [/layer|pattern/i, LuLayers],
  [/terminal|cli/i, LuTerminal],
  [/binary/i, LuBinary],
  [/anthropic/i, SiAnthropic],
  [/battle|sword/i, LuSwords],
];

function iconFor(name: string) {
  const match = RULES.find(([re]) => re.test(name));
  const Icon = match ? match[1] : LuCircleDot;
  return <Icon className={styles.icon} aria-hidden focusable="false" />;
}

/** Decorative icon beside a technology name. Always paired with the visible text. */
export function TechIcon({ name }: { name: string }) {
  return iconFor(name);
}

/** A technology name with its icon. */
export function Tech({ name }: { name: string }) {
  return (
    <span className={styles.tech}>
      <TechIcon name={name} />
      {name}
    </span>
  );
}
