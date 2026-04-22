import { PaymentData } from "@/types";

/**
 * In-memory fallback store for pending transfer confirmations.
 * Used when Supabase is not configured (dev/demo mode).
 * Not persistent across server restarts.
 */
export interface TransferEntry {
  paymentData: PaymentData;
  confirmationToken: string;
  tokenExpiresAt: string;
  contractType: string;
}

// Use global to survive Next.js hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __transferMemoryStore: Map<string, TransferEntry> | undefined;
}

if (!global.__transferMemoryStore) {
  global.__transferMemoryStore = new Map<string, TransferEntry>();
}

export const transferStore: Map<string, TransferEntry> = global.__transferMemoryStore;
