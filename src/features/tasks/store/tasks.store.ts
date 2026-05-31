import { create } from "zustand";
import type { CreateTaskPayload, Task } from "../types";



interface TasksState {
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
    createTask: (payload: CreateTaskPayload) => Promise<Task>;
}

