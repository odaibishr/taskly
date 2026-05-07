import { http } from "../../../shared/lib/http";
import type { LoginPayload, SendResetLinkPayload, SignUpPayload } from "../types";

export async function signUp(payload: SignUpPayload) {
	const response = await http.post('/auth/v1/signup', payload);
	return response.data;
}

export async function signIn(payload: LoginPayload) {
	const response = await http.post('/auth/v1/token?grant_type=password', payload);
	return response.data;
}

export async function sendResetLink(payload: SendResetLinkPayload) {
	const response = await http.post('/auth/v1/recover', payload);
	return response.data;
}