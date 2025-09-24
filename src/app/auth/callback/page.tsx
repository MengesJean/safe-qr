import { Suspense } from "react";

import { AuthCallbackHandler } from "./auth-callback-handler";

const AuthCallbackFallback = () => {
  return (
    <p className="text-sm text-slate-500">Connexion en cours...</p>
  );
};

const AuthCallbackPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Suspense fallback={<AuthCallbackFallback />}>
        <AuthCallbackHandler />
      </Suspense>
    </div>
  );
};

export default AuthCallbackPage;
