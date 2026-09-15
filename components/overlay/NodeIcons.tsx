"use client";

import React from "react";
import { type IconType } from "react-icons";
import {
  FaDiagramProject,
  FaBriefcase,
  FaCube,
  FaGraduationCap,
  FaCertificate,
  FaLayerGroup,
  FaEnvelope,
  FaJava,
  FaAws,
} from "react-icons/fa6";
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiRust,
  SiDocker,
  SiMongodb,
  SiMysql,
  SiNeo4J,
  SiGraphql,
  SiRabbitmq,
  SiRedis,
  SiLinux,
  SiGit,
  SiGithub,
  SiFlask,
  SiFastapi,
  SiTensorflow,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiNextdotjs,
  SiDotnet,
  SiGooglecloud,
} from "react-icons/si";
import type { NodeKind } from "@/lib/mesh/types";
import styles from "./NodeIcons.module.css";

export function NodeKindIcon({
  kind,
  size = 16,
}: {
  kind: NodeKind;
  size?: number;
}) {
  const kindIconMap: Record<NodeKind, IconType> = {
    hub: FaDiagramProject,
    role: FaBriefcase,
    project: FaCube,
    education: FaGraduationCap,
    certification: FaCertificate,
    skillCluster: FaLayerGroup,
    contact: FaEnvelope,
  };

  const Icon = kindIconMap[kind];

  return (
    <Icon
      size={size}
      className={styles.kindIcon}
      aria-hidden="true"
    />
  );
}

export function TechIcon({
  name,
  size = 12,
}: {
  name: string;
  size?: number;
}) {
  const techIconMap: Record<string, IconType> = {
    react: SiReact,
    typescript: SiTypescript,
    javascript: SiJavascript,
    python: SiPython,
    rust: SiRust,
    java: FaJava,
    docker: SiDocker,
    mongodb: SiMongodb,
    mysql: SiMysql,
    neo4j: SiNeo4J,
    graphql: SiGraphql,
    rabbitmq: SiRabbitmq,
    redis: SiRedis,
    linux: SiLinux,
    git: SiGit,
    github: SiGithub,
    flask: SiFlask,
    fastapi: SiFastapi,
    tensorflow: SiTensorflow,
    html: SiHtml5,
    css: SiCss,
    nodejs: SiNodedotjs,
    node: SiNodedotjs,
    nextjs: SiNextdotjs,
    next: SiNextdotjs,
    dotnet: SiDotnet,
    csharp: SiDotnet,
    "c#": SiDotnet,
    microsoft: SiDotnet,
    azure: SiDotnet,
    aws: FaAws,
    googlecloud: SiGooglecloud,
    google: SiGooglecloud,
  };

  // Normalize the name: lowercase and strip non-alphanumerics
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Try exact match first
  if (techIconMap[normalized]) {
    const Icon = techIconMap[normalized];
    return (
      <Icon
        size={size}
        className={styles.techIcon}
        aria-hidden="true"
      />
    );
  }

  // Try substring match
  for (const [key, Icon] of Object.entries(techIconMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return (
        <Icon
          size={size}
          className={styles.techIcon}
          aria-hidden="true"
        />
      );
    }
  }

  // No match found
  return null;
}
