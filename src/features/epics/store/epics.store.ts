import { create } from "zustand";
import type { CreateEpicPayload, ProjectEpic } from "@/features/epics/types";
import { createEpic, fetchEpicDetails, fetchEpicsByProjectId } from "@/features/epics/api/epics.api";

interface EpicsState {
	epics: ProjectEpic[];
	isLoading: boolean;
	error: string | null;
	selectedEpic: ProjectEpic | null;
	isSelectedEpicLoading: boolean;
	selectedEpicError: string | null;
	createEpic: (payload: CreateEpicPayload) => Promise<void>;
	getEpicsByProjectId: (projectId: string) => Promise<void>;
	getEpicDetails: (projectId: string, epicId: string) => Promise<void>;
	setSelectedEpic: (epic: ProjectEpic | null) => void;
	clearError: () => void;
}

export const useEpicsStore = create<EpicsState>()((set) => ({
	epics: [],
	isLoading: false,
	error: null,
	selectedEpic: null,
	isSelectedEpicLoading: false,
	selectedEpicError: null,
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
	getEpicDetails: async (projectId: string, epicId: string) => {
		set({
			isSelectedEpicLoading: true,
			selectedEpicError: null,
		});
		try {
			const data = await fetchEpicDetails(projectId, epicId);
			if (!data) {
				throw new Error("Epic details not found.");
			}
			set({ selectedEpic: data });
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Failed to fetch epic details";
			set({ selectedEpicError: message });
		} finally {
			set({ isSelectedEpicLoading: false });
		}
	},
	setSelectedEpic: (epic: ProjectEpic | null) => set({ selectedEpic: epic }),
	clearError: () => set({ error: null, selectedEpicError: null }),
}));
