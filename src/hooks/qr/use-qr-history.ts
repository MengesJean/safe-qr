"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/services/auth/supabase";
import { ITEMS_PER_PAGE } from "@/config";
import type { QrHistoryItem } from "@/types";

export const useQrHistory = (userId: string) => {
  const [items, setItems] = useState<QrHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const supabase = useMemo(() => getSupabaseClient(), []);

  const loadItems = useCallback(async (offset = 0, reset = false) => {
    const isInitialLoad = offset === 0 && reset;
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const { data, error } = await supabase
        .from("qr_generations")
        .select("*")
        .eq("user_id", userId)
        .order("generated_at", { ascending: false })
        .range(offset, offset + ITEMS_PER_PAGE - 1);

      if (error) {
        console.error("Failed to load QR history", error);
        return;
      }

      const newItems = data || [];
      
      if (reset) {
        setItems(newItems);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
      
      setHasMore(newItems.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Unexpected error loading QR history", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [supabase, userId]);

  const deleteItem = useCallback(async (id: string) => {
    setDeletingIds(prev => new Set([...prev, id]));

    try {
      const { error } = await supabase
        .from("qr_generations")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) {
        console.error("Failed to delete QR code", error);
        return false;
      }

      setItems(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (error) {
      console.error("Unexpected error deleting QR code", error);
      return false;
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  }, [supabase, userId]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    loadItems(items.length, false);
  }, [loadItems, items.length, hasMore, loadingMore]);

  const refresh = useCallback(() => {
    loadItems(0, true);
  }, [loadItems]);

  useEffect(() => {
    loadItems(0, true);
  }, [loadItems]);

  return {
    items,
    loading,
    loadingMore,
    hasMore,
    deletingIds,
    deleteItem,
    loadMore,
    refresh
  };
};