import { create } from "zustand";
import type { ProjectMember } from "../types";
import { getProjectMembers } from "../api/members.api";
import { fa } from "zod/locales";

interface MembersState {
    members: ProjectMember[];
    error: string | null;
    isLoading: boolean;
    clearError: () => void;
}

export const useMembersStore = create<MembersState>()((set) => ({
    members: [],
    isLoading: false,
    error: null,
    clearError: () => set({ error: null }),

    //actions
}))