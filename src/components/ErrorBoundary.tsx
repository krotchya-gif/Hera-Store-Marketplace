'use client';

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
          <span className="text-4xl mb-4">⚠️</span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-500 text-sm text-center">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan muat ulang halaman.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            Muat Ulang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
