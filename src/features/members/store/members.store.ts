import { create } from "zustand";

import { getProjectMembers } from "@/features/members/api/members.api";
import type { ProjectMember } from "@/features/members/types";

interface MembersState {
    members: ProjectMember[];
    error: string | null;
    isLoading: boolean;
    clearError: () => void;

    // actions
    getMembers: (projectId: string) => Promise<void>;
}

export const useMembersStore = create<MembersState>()((set) => ({
    members: [],
    isLoading: false,
    error: null,
    clearError: () => set({ error: null }),

    //actions
    getMembers: async (projectId: string) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getProjectMembers(projectId);
            set({ members: data });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to fetch members";
            set({ error: message });
        } finally {
            set({ isLoading: false });
        }
    }
}))