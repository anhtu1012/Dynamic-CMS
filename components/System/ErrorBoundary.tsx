"use client";

import React from "react";
import ErrorUI from "./error";

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: unknown) {
    // You can add logging here (Sentry, etc.)
    // eslint-disable-next-line no-console
    console.error("Unhandled error caught by ErrorBoundary:", error, info);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return <ErrorUI reset={this.reset} />;
    }

    return this.props.children as React.ReactElement;
  }
}
