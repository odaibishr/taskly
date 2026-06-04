import { create } from "zustand";

import { createEpic, fetchEpicDetails, fetchEpicsByProjectId } from "@/features/epics/api/epics.api";
import type { CreateEpicPayload, ProjectEpic } from "@/features/epics/types";

interface EpicsState {
	epics: ProjectEpic[];
	isLoading: boolean;
	error: string | null;
	selectedEpic: ProjectEpic | null;
	isSelectedEpicLoading: boolean;
	selectedEpicError: string | null;

	// Search and Pagination State
	searchTerm: string;
	currentPage: number;
	totalCount: number;
	limit: number;
	projectId: string | null;

	setSearchTerm: (term: string) => void;
	setCurrentPage: (page: number) => void;

	createEpic: (payload: CreateEpicPayload) => Promise<void>;
	getEpicsByProjectId: (projectId: string) => Promise<void>;
	getEpicDetails: (projectId: string, epicId: string) => Promise<void>;
	setSelectedEpic: (epic: ProjectEpic | null) => void;
	clearError: () => void;
}

export const useEpicsStore = create<EpicsState>()((set, get) => ({
	epics: [],
	isLoading: false,
	error: null,
	selectedEpic: null,
	isSelectedEpicLoading: false,
	selectedEpicError: null,

	searchTerm: "",
	currentPage: 1,
	totalCount: 0,
	limit: 10,
	projectId: null,

	setSearchTerm: (term: string) => {
		set({ searchTerm: term, currentPage: 1 });
	},
	setCurrentPage: (page: number) => {
		set({ currentPage: page });
	},

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
		const currentProjectId = get().projectId;
		if (currentProjectId !== projectId) {
			set({ projectId, searchTerm: "", currentPage: 1, totalCount: 0 });
		} else {
			set({ projectId });
		}

		set({ isLoading: true, error: null });
		const { searchTerm, currentPage, limit } = get();
		const offset = (currentPage - 1) * limit;

		try {
			const { data, total } = await fetchEpicsByProjectId(projectId, searchTerm, limit, offset);
			set({ epics: data, totalCount: total });
		} catch {
			set({ error: "Failed to search epics", epics: [], totalCount: 0 });
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
