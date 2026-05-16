import { create } from "zustand";
import type { CreateProjectPayload, Project, UpdateProjectPayload } from "../types";
import { createProject, getProjectById, getProjects, updateProject } from "../api/projects.api";
import { useAuthStore } from "../../auth/store/auth.store";



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
	createProject: (payload: CreateProjectPayload) => Promise<void>;
	getProjects: (isAppend?: boolean) => Promise<void>;
	setPage: (page: number) => void;
	getProjectById: (projectId: string) => Promise<void>;
	updateProject: (projectId: string, payload: UpdateProjectPayload);
	clearError: () => void;
}

export const useProjecteStore = create<ProjectsState>()((set, get) => ({
	projects: [],
	currentProject: null,
	isLoading: false,
	error: null,
	pagination: {
		currentPage: 1,
		limit: 6,
		totalCount: 0
	},

	createProject: async (payload) => {
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
				await useProjecteStore.getState().getProjects();
			}

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
		} catch (error: any) {
			set({ error: error.message, isLoading: false });
		}
	},

	setPage: (page: number) => {
		set((state) => ({
			pagination: { ...state.pagination, currentPage: page }
		}));
		get().getProjects(false);
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
			})
		} catch (error: any) {
			const message = error.response?.data?.message
				|| error.message || "Failed to fetch project";
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
		} catch (error: any) {
			const message = error.response?.data?.message
				|| error.message || "Failed to update project";
			set({
				isLoading: false,
				error: message
			});
		}

	},

	clearError: () => set({ error: null })
}));