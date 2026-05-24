import { create } from "zustand";
import type { CreateEpicPayload, ProjectEpic } from "@/features/epics/types";
import { createEpic, fetchEpicsByProjectId } from "@/features/epics/api/epics.api";

interface EpicsState {
	epics: ProjectEpic[];
	isLoading: boolean;
	error: string | null;
	createEpic: (payload: CreateEpicPayload) => Promise<void>;
	getEpicsByProjectId: (projectId: string) => Promise<void>;
	clearError: () => void;
}

export const useEpicsStore = create<EpicsState>()((set) => ({
	epics: [],
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
	getEpicsByProjectId: async (projectId: string) => {
		set({ isLoading: true, error: null });
		try {
			const data = await fetchEpicsByProjectId(projectId);
			set({ epics: data });
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Failed to fetch epics";
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},
	clearError: () => set({ error: null })
}));
