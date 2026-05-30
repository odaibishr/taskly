import { http } from "@/shared/lib/http";
import type { CreateTaskPayload, Task } from "@/features/tasks/types";

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
    const response = await http.post<Task[]>("/reset/v1/tasks", payload, {
        headers: {
            'Prefer': 'return=representation'
        }
    });

    return response.data[0];
}