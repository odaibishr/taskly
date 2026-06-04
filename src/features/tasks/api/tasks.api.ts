import type { CreateTaskPayload, ProjectTask, Task, TaskStatus } from "@/features/tasks/types";
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

export async function fetchTasksByStatus(projectId: string, status: TaskStatus): Promise<ProjectTask[]> {
    const response = await http.get<ProjectTask[]>(`/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${status}`);
    return response.data;
}

export async function fetchTasksByProjectId(
    projectId: string,
    limit?: number,
    offset?: number
): Promise<{ data: ProjectTask[]; total: number }> {
    const params = new URLSearchParams();
    params.append("project_id", `eq.${projectId}`);
    if (limit !== undefined) {
        params.append("limit", String(limit));
    }
    if (offset !== undefined) {
        params.append("offset", String(offset));
    }

    const response = await http.get<ProjectTask[]>(`/rest/v1/project_tasks?${params.toString()}`, {
        headers: {
            'Prefer': 'count=exact'
        }
    });

    const contentRange = response.headers['content-range'];
    let total = response.data.length;
    if (contentRange) {
        const match = contentRange.match(/\/(\d+)$/);
        if (match) {
            total = parseInt(match[1], 10);
        }
    }

    return {
        data: response.data,
        total
    };
}

export async function fetchTaskDetails(projectId: string, taskId: string): Promise<ProjectTask> {
    const response = await http.get<ProjectTask[]>(`/rest/v1/project_tasks?project_id=eq.${projectId}&id=eq.${taskId}`);
    return response.data[0];
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
    await http.patch(`/rest/v1/tasks?id=eq.${taskId}`, { status });
}