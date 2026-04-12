'use client';

import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div
      role="alert"
      className="p-6 border border-red-900/50 bg-red-950/20 rounded-xl flex flex-col items-center justify-center text-center space-y-4"
    >
      <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center text-red-400">
        <AlertCircle size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-red-200">System Module Failure</h3>
        <p className="text-sm text-red-400 mt-1 max-w-sm">
          {error instanceof Error ? error.message : 'An unexpected error occurred while rendering this feature.'}
        </p>
      </div>
      <Button
        onClick={resetErrorBoundary}
        variant="outline"
        className="mt-4 border-red-800 text-red-300 hover:bg-red-900/40"
      >
        <RefreshCw size={16} className="mr-2" />
        Retry Loading
      </Button>
    </div>
  );
}

export function FeatureErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
