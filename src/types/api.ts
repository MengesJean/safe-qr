export type MetadataResult = {
  success: true;
  data: {
    title: string | null;
    imageUrl: string | null;
  };
} | {
  success: false;
  error: string;
};

export type LogQrResult = {
  success: boolean;
  error?: string;
};

export type RateLimitRecord = {
  count: number;
  resetTime: number;
};