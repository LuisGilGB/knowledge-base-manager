'use client';

import { ErrorBoundary } from "react-error-boundary";
import { cn } from "@/lib/utils";
import { CircleAlert, Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

interface ViewBoundaryProps {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  onErrorReset?: () => void;
}

const windowReload = () => {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

const DefaultErrorFallback = ({ className, reset }: { className?: string; reset?: () => void }) => {
  return (
    <div className={cn("flex flex-col justify-center items-center max-w-md mx-auto p-4", className)}>
      <CircleAlert className="size-12 text-red-400" />
      <p className="text-red-400 text-center mt-2">Something went wrong</p>
      <Button className="mt-4" onClick={reset || windowReload}>Retry</Button>
    </div>
  )
}

const DefaultFallback = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col gap-2 justify-center items-center max-w-md mx-auto p-4", className)}>
      <Loader2 className="size-12 animate-spin" />
      <p className="text-gray-500 text-center">Loading...</p>
    </div>
  )
}

const ViewBoundary = ({ children, className, fallback, errorFallback, onErrorReset }: ViewBoundaryProps) => {
  return (
    <ErrorBoundary fallback={errorFallback || <DefaultErrorFallback className={className} reset={onErrorReset} />} onReset={onErrorReset}>
      <Suspense fallback={fallback || <DefaultFallback className={className} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default ViewBoundary;
