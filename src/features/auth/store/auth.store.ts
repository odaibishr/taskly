import { create } from "zustand";
import { signIn, signUp } from "../api/auth.api";
import type { LoginPayload, SignUpPayload } from "../types";

interface AuthState {
	user: any | null;
	isLoading: boolean;
	error: string | null;
	isSignUpSuccess: boolean;
	handleSignUp: (payload: SignUpPayload) => Promise<void>;
	handleSignIn: (payload: LoginPayload) => Promise<void>;
	clearError: () => void;
	reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: JSON.parse(localStorage.getItem('user') || 'null'),
	isLoading: false,
	error: null,
	isSignUpSuccess: false,
	handleSignUp: async (payload) => {
		set({ isLoading: true, error: null, isSignUpSuccess: false });
		try {
			await signUp(payload);
			set({ isSignUpSuccess: true });
		} catch (error: any) {
			const message = error.response?.data?.msg || error.message || 'Something went wrong. Please try again.';
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},
	handleSignIn: async (payload) => {
		set({
			isLoading: true,
			error: null,
		});
		try {
			const data = await signIn(payload);
			localStorage.setItem('access_token', data.access_token);
			localStorage.setItem('refresh_token', data.refresh_token);
			localStorage.setItem('user', JSON.stringify(data.user));
			set({ user: data.user });
			window.location.href = '/'
		} catch (error: any) {
			const message = error.response?.data?.error_description || error.message || 'Login failed.';
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},
	clearError: () => set({ error: null }),
	reset: () => set({ isLoading: false, error: null, isSignUpSuccess: false }),
}));