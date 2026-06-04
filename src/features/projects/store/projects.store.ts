import { create } from "zustand";

import { useAuthStore } from "@/features/auth";
import { createProject, getProjectById, getProjects, updateProject } from "@/features/projects/api/projects.api";
import type { CreateProjectInput, Project, UpdateProjectPayload } from "@/features/projects/types";

interface ProjectsState {
	/**
	 * Paginated list — always holds exactly one page of projects (desktop grid).
	 * Overwritten on every `setPage` / `getProjects(false)` call.
	 */
	projects: Project[];
	/**
	 * Infinite-scroll list — accumulated across all loaded pages (mobile feed).
	 * Appended to on every `loadNextPage` / `getProjects(true)` call.
	 * Reset by `resetInfiniteProjects` when the mobile view mounts.
	 */
	infiniteProjects: Project[];
	currentProject: Project | null;
	isLoading: boolean;
	error: string | null;
	pagination: {
		currentPage: number;
		limit: number;
		totalCount: number;
	}

	// actions
	createProject: (payload: CreateProjectInput) => Promise<void>;
	/** @param isAppend – false → overwrite `projects`; true → append to `infiniteProjects` */
	getProjects: (isAppend?: boolean) => Promise<void>;
	setPage: (page: number) => void;
	loadNextPage: () => void;
	resetInfiniteProjects: () => void;
	getProjectById: (projectId: string) => Promise<void>;
	updateProject: (projectId: string, payload: UpdateProjectPayload) => Promise<void>;
	clearError: () => void;
}

export const useProjectsStore = create<ProjectsState>()((set, get) => ({
	projects: [],
	infiniteProjects: [],
	currentProject: null,
	isLoading: false,
	error: null,
	pagination: {
		currentPage: 1,
		limit: 6,
		totalCount: 0
	},

	createProject: async (payload: CreateProjectInput) => {
		set({ isLoading: true, error: null });
		try {
			const user = useAuthStore.getState().user;
			if (!user) throw new Error("User not authenticated");

			const newProject = await createProject({
				...payload,
				created_by: user.id
			});

			if (newProject) {
				set((state) => ({
					// Add to both lists so the new project appears in whichever view is active
					projects: [...state.projects, newProject],
					infiniteProjects: [...state.infiniteProjects, newProject],
					isLoading: false,
				}));
			} else {
				// Fallback: re-fetch both views
				await useProjectsStore.getState().getProjects(false);
			}

		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Failed to create project";
			set({ isLoading: false, error: message });
			throw new Error(message);
		}
	},

	getProjects: async (isAppend = false) => {
		const { currentPage, limit } = get().pagination;
		const offset = (currentPage - 1) * limit;
		set({ isLoading: true, error: null });
		try {
			const { data, totalCount } = await getProjects({ limit, offset });

			set((state) => ({
				// Paginated list: always a clean single page
				projects: isAppend ? state.projects : data,
				// Infinite-scroll list: accumulate pages
				infiniteProjects: isAppend
					? [
						...state.infiniteProjects,
						...data.filter(
							(p: Project) => !state.infiniteProjects.some((existing) => existing.id === p.id)
						),
					]
					: state.infiniteProjects,
				pagination: { ...state.pagination, totalCount },
				isLoading: false
			}));
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Failed to fetch projects";
			set({ error: message, isLoading: false });
		}
	},

	/** Changes the current desktop pagination page and fetches a fresh page. */
	setPage: (page: number) => {
		set((state) => ({
			pagination: { ...state.pagination, currentPage: page }
		}));
		get().getProjects(false);
	},

	/** Loads the next page into `infiniteProjects` (mobile infinite scroll). */
	loadNextPage: () => {
		const { currentPage, totalCount, limit } = get().pagination;
		if (currentPage * limit < totalCount) {
			set((state) => ({
				pagination: { ...state.pagination, currentPage: state.pagination.currentPage + 1 }
			}));
			get().getProjects(true);
		}
	},

	/** Clears the infinite-scroll list. Call this when the mobile view mounts. */
	resetInfiniteProjects: () => {
		set((state) => ({
			infiniteProjects: [],
			pagination: { ...state.pagination, currentPage: 1 }
		}));
	},

	getProjectById: async (projectId: string) => {
		set({ isLoading: true, error: null });
		try {
			const project = await getProjectById(projectId);
			set({ isLoading: false, currentProject: project });
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Failed to fetch project";
			set({ isLoading: false, error: message });
		}
	},

	updateProject: async (projectId: string, payload: UpdateProjectPayload) => {
		set({ isLoading: true, error: null });
		try {
			await updateProject(projectId, payload);
			set((state) => ({
				projects: state.projects.map((project) =>
					project.id === projectId ? { ...project, ...payload } : project
				),
				infiniteProjects: state.infiniteProjects.map((project) =>
					project.id === projectId ? { ...project, ...payload } : project
				),
				isLoading: false,
			}));
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Failed to update project";
			set({ isLoading: false, error: message });
		}
	},

	clearError: () => set({ error: null })
}));
