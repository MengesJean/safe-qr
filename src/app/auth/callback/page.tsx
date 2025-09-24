"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getSupabaseClient } from "@/lib/supabase-client";

type Status = {
  message: string;
  isError?: boolean;
};

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>({ message: "Connexion en cours..." });

  const authCode = useMemo(() => searchParams.get("code"), [searchParams]);
  const errorDescription = useMemo(() => searchParams.get("error_description"), [searchParams]);

  useEffect(() => {
    const supabase = getSupabaseClient();

    if (errorDescription) {
      setStatus({ message: decodeURIComponent(errorDescription), isError: true });
      return;
    }

    if (!authCode) {
      router.replace("/");
      return;
    }

    void supabase.auth.exchangeCodeForSession({ authCode }).then(({ error }) => {
      if (error) {
        setStatus({ message: error.message, isError: true });
        return;
      }

      router.replace("/");
    });
  }, [authCode, errorDescription, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className={`text-sm ${status.isError ? "text-rose-500" : "text-slate-500"}`}>
        {status.message}
      </p>
    </div>
  );
}
