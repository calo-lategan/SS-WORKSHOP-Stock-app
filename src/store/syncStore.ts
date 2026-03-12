import {create} from 'zustand';

interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncAt: string | null;
  pendingCount: number;
  error: string | null;
  setOnline: (v: boolean) => void;
  setSyncing: (v: boolean) => void;
  setLastSync: (t: string) => void;
  setPendingCount: (n: number) => void;
  setError: (e: string | null) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,
  lastSyncAt: null,
  pendingCount: 0,
  error: null,
  setOnline: (v) => set({ isOnline: v }),
  setSyncing: (v) => set({ isSyncing: v }),
  setLastSync: (t) => set({ lastSyncAt: t }),
  setPendingCount: (n) => set({ pendingCount: n }),
  setError: (e) => set({ error: e }),
}));
