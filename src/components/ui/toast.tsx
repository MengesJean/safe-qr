"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastProps = {
  toast: Toast;
  onRemove: (id: string) => void;
};

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const toastStyles = {
  success: "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
  error: "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200",
  info: "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200",
};

export function Toast({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const Icon = toastIcons[toast.type];

  const handleRemove = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  }, [toast.id, onRemove]);

  useEffect(() => {
    // Entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Auto-remove
    const timer = setTimeout(() => {
      handleRemove();
    }, 3000);

    return () => clearTimeout(timer);
  }, [handleRemove]);

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-sm transform items-center gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out",
        toastStyles[toast.type],
        isVisible && !isExiting 
          ? "translate-x-0 opacity-100" 
          : "translate-x-full opacity-0"
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={handleRemove}
        className="flex-shrink-0 rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

type ToastContainerProps = {
  toasts: Toast[];
  onRemove: (id: string) => void;
};

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}