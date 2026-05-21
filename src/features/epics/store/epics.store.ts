import { create } from "zustand";
import type { CreateEpicPayload } from "@/features/epics/types";
import { createEpic } from "@/features/epics/api/epics.api";

interface EpicsState {
	isLoading: boolean;
	error: string | null;
	createEpic: (payload: CreateEpicPayload) => Promise<void>;
	clearError: () => void;
}

export const useEpicsStore = create<EpicsState>()((set) => ({
	isLoading: false,
	error: null,
	createEpic: async (payload: CreateEpicPayload) => {
		set({ isLoading: true, error: null });
		try {
			await createEpic(payload);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Failed to create epic";
			set({ error: message });
			throw new Error(message);
		} finally {
			set({ isLoading: false });
		}
	},
	clearError: () => set({ error: null })
}));
