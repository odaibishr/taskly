import { http } from "../../../shared/lib/http";
import type { CreateProjectPayload } from "../types";

export async function createProject(payload: CreateProjectPayload) {
	const response = await http.post('/rest/v1/projects', payload);
	return response.data[0];
}

export async function getProjects() {
	const response = await http.get('/rest/v1/rpc/get_projects');
	return response.data;
}