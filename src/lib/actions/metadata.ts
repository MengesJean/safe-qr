"use server";

import { fetchUrlMetadata as fetchMetadata } from "@/services/qr/metadata";
import type { MetadataResult } from "@/types";

export const fetchUrlMetadata = async (url: string): Promise<MetadataResult> => {
  return await fetchMetadata(url);
};