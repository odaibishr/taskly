export type TaskStatus =
    | "TO_DO"
    | "IN_PROGRESS"
    | "BLOCKED"
    | "IN_REVIEW"
    | "READY_FOR_QA"
    | "REOPENED"
    | "READY_FOR_PRODUCTION"
    | "DONE";

export interface Task {
    id: string;
    project_id: string;
    epic_id: string | null;
    title: string;
    description: string | null;
    assignee_id: string | null;
    due_date: string | null;
    status: TaskStatus;
}

export interface ProjectTask {
    id: string;
    project_id: string;
    epic_id: string | null;
    title: string;
    description: string | null;
    assignee_id: string | null;
    assignee_name: string | null;
    assignee_avatar: string | null;
    due_date: string | null;
    status: TaskStatus;
    created_at?: string | null;
    reporter_name?: string | null;
}

export type CreateTaskPayload = Omit<Task, "id">;