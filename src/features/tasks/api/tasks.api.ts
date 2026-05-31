import type { CreateTaskPayload, ProjectTask, Task } from "@/features/tasks/types";
import { http } from "@/shared/lib/http";

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
    const response = await http.post<Task[]>("/rest/v1/tasks", payload, {
        headers: {
            'Prefer': 'return=representation'
        }
    });

    return response.data[0];
}

export async function fetchTasksByEpicId(epicId: string): Promise<ProjectTask[]> {
    const response = await http.get<ProjectTask[]>(`/rest/v1/project_tasks?epic_id=eq.${epicId}`);
    return response.data;
}