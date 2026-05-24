import { http } from "@/shared/lib/http";
import type { ProjectMember } from "@/features/members/types";

export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    const response = await http.get(`/rest/v1/get_project_members?project_id=eq.${projectId}`)
    return response.data;
}