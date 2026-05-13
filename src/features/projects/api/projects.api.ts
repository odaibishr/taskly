import { http } from "../../../shared/lib/http";
import type { CreateProjectPayload, GetProjectsParams } from "../types";

export async function createProject(payload: CreateProjectPayload) {
	const response = await http.post('/rest/v1/projects', payload);
	return response.data[0];
}

export async function getProjects(params: GetProjectsParams) {
	const response = await http.get(
		'/rest/v1/rpc/get_projects',
		{
			params,
			headers: {
				'Prefer': 'count=exact'
			}
		});

	const contentRange = response.headers['content-range'];
	const totalCount = contentRange ? parseInt(contentRange.split('/')[1]) : 0;
	return {
		data: response.data,
		totalCount
	}
}