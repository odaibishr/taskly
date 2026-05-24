export interface Epic {
	id: string;
	title: string;
	description: string | null;
	assignee_id: string | null;
	project_id: string;
	deadline: string | null;
	created_at?: string;
}

export type CreateEpicPayload = Omit<Epic, "id" | "created_at">;
