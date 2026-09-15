"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered instead of the 3D experience if anything in it throws. */
  fallback: ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * WebGL can fail for reasons capability detection cannot predict — a driver
 * blocklist, a lost context, an out-of-memory shader compile. Without this, such
 * a failure leaves the visitor staring at an empty dark screen; with it they get
 * the full static version of the site instead.
 */
export class ExperienceBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.error("3D experience failed, showing static fallback:", error);
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
