import { create } from "zustand";
import { signUp } from "../api/auth.api";
import type { SignUpPayload } from "../types";

interface AuthState {
	isLoading: boolean;
	error: string | null;
	isSignUpSuccess: boolean;
	handleSignUp: (payload: SignUpPayload) => Promise<void>;
	clearError: () => void;
	reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
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
	clearError: () => set({ error: null }),
	reset: () => set({ isLoading: false, error: null, isSignUpSuccess: false }),
}));