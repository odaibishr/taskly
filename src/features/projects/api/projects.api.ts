import { http } from "../../../shared/lib/http";
import type { CreateProjectPayload } from "../types";

export async function createProject(payload: CreateProjectPayload) {
	const response = await http.post('/rest/v1/projects', payload);
	return response.data;
}