"use client";

import { CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseSession } from "@/hooks/use-supabase-session";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AuthPrompt } from "@/components/auth/auth-prompt";
import { QrMetadataLogger } from "./qr-metadata-logger";

import { QrGenerator } from "./qr-generator";
import { QrHistory } from "./qr-history";

export const QrGeneratorWithAuth = () => {
  const { session, isLoading } = useSupabaseSession();

  return (
    <AuthGuard
      isLoading={isLoading}
      isAuthenticated={Boolean(session)}
      fallback={<AuthPrompt />}
    >
      <Tabs defaultValue="generate" className="w-full">
        <CardContent className="pb-0">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="generate">Générer</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
        </CardContent>
        <TabsContent value="generate">
          <QrMetadataLogger userId={session?.user.id}>
            {(onLog) => <QrGenerator onLog={onLog} />}
          </QrMetadataLogger>
        </TabsContent>
        <TabsContent value="history">
          <CardContent className="space-y-4">
            {session?.user?.id && <QrHistory userId={session.user.id} />}
          </CardContent>
        </TabsContent>
      </Tabs>
    </AuthGuard>
  );
};
