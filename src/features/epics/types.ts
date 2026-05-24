export interface Epic {
	id: string;
	title: string;
	description: string | null;
	assignee_id: string | null;
	project_id: string;
	deadline: string | null;
	created_at?: string;
	created_by: string;
}

export type CreateEpicPayload = Omit<Epic, "id" | "created_at">;

export interface EpicUser {
	sub: string;
	name: string;
	email: string;
	department: string;
}

export interface ProjectEpic {
	id: string;
	epic_id: string;
	title: string;
	description: string | null;
	deadline: string | null;
	created_at: string;
	created_by: EpicUser;
	assignee: EpicUser | null;
}