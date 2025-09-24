import { QrGeneratorWithAuth } from "@/components/qr/qr-generator-with-auth";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <Card className="w-full max-w-xl border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
          Générateur de QR code
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-300">
          Convertissez instantanément une URL en QR code prêt à partager.
        </CardDescription>
      </CardHeader>
      <QrGeneratorWithAuth />
    </Card>
  );
}
