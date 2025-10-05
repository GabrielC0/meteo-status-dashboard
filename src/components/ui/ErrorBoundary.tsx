'use client';

import React from 'react';

type ErrorBoundaryProps = React.PropsWithChildren<{
  fallback?: React.ReactNode;
}>;

type ErrorBoundaryState = {
  hasError: boolean;
};

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo): void {}

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? <div>Une erreur est survenue.</div>;
    }
    return this.props.children;
  }
}
