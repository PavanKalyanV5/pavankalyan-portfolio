"use client";

import { Component, type ReactNode } from "react";
import { HeroFallback } from "./HeroFallback";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class HeroErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <HeroFallback />;
    return this.props.children;
  }
}
