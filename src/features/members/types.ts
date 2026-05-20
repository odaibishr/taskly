export type ProjectRole = "owner" | "admin" | "member" | "viewer";

export interface ProjectMember {
    id: string;
    name: string;
    email: string;
    role: ProjectRole;
    avatar_url?: string;
}