import { create } from "zustand";
import type { CreateProjectPayload, Project } from "../types";
import { createProject } from "../api/projects.api";
import { useAuthStore } from "../../auth/store/auth.store";



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
			const user = useAuthStore.getState().user;
			if (!user) throw new Error("User not authenticated");

			const newProject = await createProject({
				...payload,
				created_by: user.id
			});

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