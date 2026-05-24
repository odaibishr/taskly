import { create } from "zustand";
import type { CreateProjectInput, Project, UpdateProjectPayload } from "@/features/projects/types";
import { createProject, getProjectById, getProjects, updateProject } from "@/features/projects/api/projects.api";
import { useAuthStore } from "@/features/auth";

interface ProjectsState {
	projects: Project[];
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
	getProjects: (isAppend?: boolean) => Promise<void>;
	setPage: (page: number) => void;
	loadNextPage: () => void;
	getProjectById: (projectId: string) => Promise<void>;
	updateProject: (projectId: string, payload: UpdateProjectPayload) => Promise<void>;
	clearError: () => void;
}

export const useProjectsStore = create<ProjectsState>()((set, get) => ({
	projects: [],
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
					projects: [...state.projects, newProject],
					isLoading: false,
				}));
			} else {
				await useProjectsStore.getState().getProjects();
			}

		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Failed to create project";
			set({
				isLoading: false,
				error: message,
			});

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
				projects: isAppend ? [...state.projects, ...data] : data,
				pagination: { ...state.pagination, totalCount },
				isLoading: false
			}));
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Failed to fetch projects";
			set({ error: message, isLoading: false });
		}
	},

	setPage: (page: number) => {
		set((state) => ({
			pagination: { ...state.pagination, currentPage: page }
		}));
		get().getProjects(false);
	},

	loadNextPage: () => {
		const { currentPage, totalCount, limit } = get().pagination;
		if (currentPage * limit < totalCount) {
			set((state) => ({
				pagination: { ...state.pagination, currentPage: state.pagination.currentPage + 1 }
			}));
			get().getProjects(true);
		}
	},

	getProjectById: async (projectId: string) => {
		set({
			isLoading: true,
			error: null
		});

		try {
			const project = await getProjectById(projectId);
			set({
				isLoading: false,
				currentProject: project
			});
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Failed to fetch project";
			set({
				isLoading: false,
				error: message
			});
		}
	},

	updateProject: async (projectId: string, payload: UpdateProjectPayload) => {
		set({
			isLoading: true,
			error: null
		});

		try {
			await updateProject(projectId, payload);
			set((state) => ({
				projects: state.projects.map((project) => {
					if (project.id === projectId) {
						return { ...project, ...payload };
					}
					return project;
				}),
				isLoading: false,
			}));
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Failed to update project";
			set({
				isLoading: false,
				error: message
			});
		}

	},

	clearError: () => set({ error: null })
}));
