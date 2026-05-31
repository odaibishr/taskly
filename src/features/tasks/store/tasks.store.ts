import { create } from "zustand";

import { createTask } from "@/features/tasks/api/tasks.api";
import type { CreateTaskPayload, Task } from "@/features/tasks/types";



interface TasksState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
    createTask: (payload: CreateTaskPayload) => Promise<void>;
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
        } finally {
            set({
                isLoading: false,
            });
        }
    },
    clearError: () => set({ error: null }),
}))