import { create } from "zustand";
import type { CreateProjectPayload, Project } from "../types";
import { createProject } from "../api/projects.api";


interface ProjectsState {
	projects: Project[];
	isLoading: boolean;
	error: string | null;

	// actions
	createProject: (payload: CreateProjectPayload) => Promise<void>;
	clearError: () => void;
}

export const useProjecteStore = create<ProjectsState>()((set) => ({
	projects: [],
	isLoading: false,
	error: null,
	createProject: async (payload) => {
		set({ isLoading: true, error: null });
		try {
			const newProject = await createProject(payload);
			set((state) => ({
				projects: [...state.projects, newProject],
				isLoading: false,
			}))

		} catch (error: any) {
			const message = error.response?.data?.message
				|| error.message || "Failed to create project";
			set({
				isLoading: false,
				error: message,
			});

			throw new Error(message);
		}
	},
	clearError: () => set({ error: null })
}))