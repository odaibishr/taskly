import type { CreateEpicPayload, Epic, ProjectEpic } from "@/features/epics/types";
import { http } from "@/shared/lib/http";
import { parseContentRange } from "@/shared/lib/utils";

export async function createEpic(payload: CreateEpicPayload): Promise<Epic> {
	const response = await http.post<Epic[]>('/rest/v1/epics', payload, {
		headers: {
			'Prefer': 'return=representation'
		}
	});
	return response.data[0];
}

export async function fetchEpicsByProjectId(
	projectId: string,
	searchTerm?: string,
	limit?: number,
	offset?: number
): Promise<{ data: ProjectEpic[]; total: number }> {
	const params = new URLSearchParams();
	params.append("project_id", `eq.${projectId}`);
	if (searchTerm) {
		params.append("title", `ilike.%${searchTerm}%`);
	}
	if (limit !== undefined) {
		params.append("limit", String(limit));
	}
	if (offset !== undefined) {
		params.append("offset", String(offset));
	}

	const response = await http.get<ProjectEpic[]>(`/rest/v1/project_epics?${params.toString()}`, {
		headers: {
			'Prefer': 'count=exact'
		}
	});

	const total = parseContentRange(response.headers['content-range'], response.data.length);

	return {
		data: response.data,
		total
	};
}

export async function fetchEpicDetails(projectId: string, epicId: string): Promise<ProjectEpic> {
	const response = await http.get(`/rest/v1/project_epics?project_id=eq.${projectId}&id=eq.${epicId}`);
	return response.data[0];
}