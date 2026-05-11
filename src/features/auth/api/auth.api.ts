import { http } from "../../../shared/lib/http";
import type { LoginPayload, SendResetLinkPayload, SignUpPayload, UpdatePasswordPayload } from "../types";

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

export async function updatePassword(payload: UpdatePasswordPayload) {
	const response = await http.put('/auth/v1/user', payload);
	return response.data;
}

export async function logout() {
	const response = await http.post('/auth/v1/logout');
	return response.data;
}