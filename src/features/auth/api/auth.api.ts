import { http } from "../../../shared/lib/http";
import type { SignUpPayload } from "../types";

export async function signUp(payload: SignUpPayload) {
	const response = await http.post('/auth/v1/signup', payload);
	return response.data;
}