import { http } from "@/shared/lib/http";
import type { CreateEpicPayload, Epic } from "@/features/epics/types";

export async function createEpic(payload: CreateEpicPayload): Promise<Epic> {
	const response = await http.post<Epic[]>('/rest/v1/epics', payload, {
		headers: {
			'Prefer': 'return=representation'
		}
	});
	return response.data[0];
}
