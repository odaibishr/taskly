import { http } from "@/shared/lib/http";
import type { CreateEpicPayload, Epic, ProjectEpic } from "@/features/epics/types";

export async function createEpic(payload: CreateEpicPayload): Promise<Epic> {
	const response = await http.post<Epic[]>('/rest/v1/epics', payload, {
		headers: {
			'Prefer': 'return=representation'
		}
	});
	return response.data[0];
}

export async function getEpicsByProjectId(projectId: string): Promise<ProjectEpic[]> {
	const response = await http.get<ProjectEpic[]>(`/rest/v1/project_epics?project_id=eq.${projectId}`);
	return response.data;
}