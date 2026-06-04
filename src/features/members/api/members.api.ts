import type { ProjectMember } from "@/features/members/types";
import { http } from "@/shared/lib/http";

export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const response = await http.get(`/rest/v1/get_project_members?project_id=eq.${projectId}`)
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

export async function acceptInvitation(payload: AcceptInvitationPayload): Promise<{ project_id?: string; project_name?: string } | unknown> {
    const response = await http.post("/rest/v1/rpc/accept_invitation", payload);
    return response.data;
}