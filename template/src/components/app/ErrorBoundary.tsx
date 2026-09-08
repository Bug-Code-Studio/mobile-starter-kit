import React, {
  Component,
  type ErrorInfo,
  type ReactNode,
} from 'react';

import { ErrorState } from './ErrorState';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(
    error: Error,
    errorInfo: ErrorInfo,
  ) {
    console.error(
      '[ErrorBoundary]',
      error,
      errorInfo,
    );
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}