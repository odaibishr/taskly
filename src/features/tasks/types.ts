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

export type CreateTaskPayload = Omit<Task, "id">;