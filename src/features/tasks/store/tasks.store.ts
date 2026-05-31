import { create } from "zustand";

import { createTask, fetchTasksByEpicId } from "@/features/tasks/api/tasks.api";
import type { CreateTaskPayload, ProjectTask, Task } from "@/features/tasks/types";



interface TasksState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
    createTask: (payload: CreateTaskPayload) => Promise<void>;
    epicTasks: ProjectTask[];
    isEpicTasksLoading: boolean;
    epicTasksError: string | null;
    getEpicTasks: (epicId: string) => Promise<void>;
    clearEpicTasks: () => void;
}

export const useTasksStore = create<TasksState>()((set, get) => ({
    tasks: [],
    isLoading: false,
    error: null,
    createTask: async (payload: CreateTaskPayload) => {
        set({
            isLoading: true,
            error: null,
        })

        try {
            const data = await createTask(payload);
            set({
                tasks: [...get().tasks, data],
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to create task";
            set({
                error: message,
            });
            throw new Error(message);
        } finally {
            set({
                isLoading: false,
            });
        }
    },
    clearError: () => set({ error: null }),
    epicTasks: [],
    isEpicTasksLoading: false,
    epicTasksError: null,
    getEpicTasks: async (epicId: string) => {
        set({
            isEpicTasksLoading: true,
            epicTasksError: null,
        });
        try {
            const data = await fetchTasksByEpicId(epicId);
            set({
                epicTasks: data,
            });
        } catch {
            set({
                epicTasksError: "Failed to load tasks",
            });
        } finally {
            set({
                isEpicTasksLoading: false,
            });
        }
    },
    clearEpicTasks: () => set({ epicTasks: [], epicTasksError: null }),
}))