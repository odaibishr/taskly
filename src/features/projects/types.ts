export interface Project {
	id: string;
	name: string;
	description: string | null;
	created_by: string;
	created_at: string | null;
}

export interface CreateProjectPayload extends Pick<Project, "name" | "description" | "created_by"> {
}

export interface GetProjectsParams {
	limit: number;
	offset: number;
}

export interface GetProjectByIdParams {
	projectId: string;
}

