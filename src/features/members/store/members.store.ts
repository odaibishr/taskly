import { create } from "zustand";

import {
    getProjectMembers,
    removeMember,
    updateMemberRole,
} from "@/features/members/api/members.api";
import type { ProjectMember, ProjectRole } from "@/features/members/types";

interface MembersState {
    members: ProjectMember[];
    error: string | null;
    isLoading: boolean;
    clearError: () => void;

    // actions
    getMembers: (projectId: string) => Promise<void>;
    updateMemberRole: (memberId: string, projectId: string, newRole: ProjectRole) => Promise<void>;
    removeMember: (memberId: string, projectId: string) => Promise<void>;
}

export const useMembersStore = create<MembersState>()((set, get) => ({
    members: [],
    isLoading: false,
    error: null,
    clearError: () => set({ error: null }),

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
    },

    updateMemberRole: async (memberId, projectId, newRole) => {
        // Optimistic update
        const previous = get().members;
        set({
            members: previous.map((m) =>
                m.id === memberId ? { ...m, role: newRole } : m,
            ),
        });
        try {
            await updateMemberRole({ p_member_id: memberId, p_project_id: projectId, p_new_role: newRole });
        } catch (error: unknown) {
            // Roll back on failure
            set({ members: previous });
            const message = error instanceof Error ? error.message : "Failed to update member role";
            set({ error: message });
            throw error;
        }
    },

    removeMember: async (memberId, projectId) => {
        // Optimistic update
        const previous = get().members;
        set({ members: previous.filter((m) => m.id !== memberId) });
        try {
            await removeMember({ p_member_id: memberId, p_project_id: projectId });
        } catch (error: unknown) {
            // Roll back on failure
            set({ members: previous });
            const message = error instanceof Error ? error.message : "Failed to remove member";
            set({ error: message });
            throw error;
        }
    },
}));