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
		} catch (error: unknown) {
			const message = (error as { response?: { data?: { msg?: string } } }).response?.data?.msg ?? 'Something went worng. Please try againg.';
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},
	clearError: () => set({ error: null }),
	reset: () => set({ isLoading: false, error: null, isSignUpSuccess: false }),
}));