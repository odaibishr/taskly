import type { ProjectMember, ProjectRole } from "@/features/members/types";
import { http } from "@/shared/lib/http";

export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const response = await http.get(`/rest/v1/get_project_members?project_id=eq.${projectId}`);
    return response.data;
}

export interface InviteMemberPayload {
    p_email: string;
    p_project_id: string;
    p_app_url: string;
    p_base_url: string;
}

export async function inviteMember(payload: InviteMemberPayload): Promise<void> {
    await http.post("/rest/v1/rpc/invite_member", payload);
}

export interface AcceptInvitationPayload {
    p_token: string;
}

export async function acceptInvitation(
    payload: AcceptInvitationPayload,
): Promise<{ project_id?: string; project_name?: string } | unknown> {
    const response = await http.post("/rest/v1/rpc/accept_invitation", payload);
    return response.data;
}

export interface UpdateMemberRolePayload {
    p_member_id: string;
    p_project_id: string;
    p_new_role: ProjectRole;
}

/** Updates a project member's role via a Supabase RPC function. */
export async function updateMemberRole(payload: UpdateMemberRolePayload): Promise<void> {
    await http.post("/rest/v1/rpc/update_member_role", payload);
}

export interface RemoveMemberPayload {
    p_member_id: string;
    p_project_id: string;
}

/** Removes a member from the project via a Supabase RPC function. */
export async function removeMember(payload: RemoveMemberPayload): Promise<void> {
    await http.post("/rest/v1/rpc/remove_member", payload);
}