"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const getValidationClasses = (isValid: boolean, isInvalid: boolean) => {
  return cn(
    "border-slate-300 bg-white/80 text-slate-900 placeholder:text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-50",
    isValid &&
      "border-emerald-500 focus-visible:ring-emerald-500/40 dark:border-emerald-400 dark:focus-visible:ring-emerald-400/40",
    isInvalid &&
      "border-rose-500 focus-visible:ring-rose-500/40 dark:border-rose-400 dark:focus-visible:ring-rose-400/40",
  );
};

export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      return await fn();
    } finally {
      setIsLoading(false);
    }
  };
  
  return { isLoading, withLoading };
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};