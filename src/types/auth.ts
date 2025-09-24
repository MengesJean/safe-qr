export type AuthState = "idle" | "pending";

export type AuthError = {
  message: string;
};

export type SignInOptions = {
  redirectTo?: string;
  provider?: "google";
};