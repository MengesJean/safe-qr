"use client";

import { CardContent } from "@/components/ui/card";

type AuthGuardProps = {
  children: React.ReactNode;
  isLoading: boolean;
  isAuthenticated: boolean;
  fallback: React.ReactNode;
};

export const AuthGuard = ({ children, isLoading, isAuthenticated, fallback }: AuthGuardProps) => {
  if (isLoading) {
    return (
      <CardContent className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500 dark:text-slate-400">Chargement de votre session...</p>
      </CardContent>
    );
  }

  if (!isAuthenticated) {
    return fallback;
  }

  return <>{children}</>;
};