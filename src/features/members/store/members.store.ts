import { create } from "zustand";
import type { ProjectMember } from "../types";
import { getProjectMembers } from "../api/members.api";

interface MembersState {
    members: ProjectMember[];
    error: string | null;
    isLoading: boolean;
    clearError: () => void;
}