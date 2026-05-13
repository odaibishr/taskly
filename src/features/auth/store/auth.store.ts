import { create } from "zustand";
import { sendResetLink, signIn, signUp, updatePassword, logout } from "../api/auth.api";
import type { LoginPayload, SendResetLinkPayload, SignUpPayload, UpdatePasswordPayload } from "../types";

interface AuthState {
	user: any | null;
	isLoading: boolean;
	error: string | null;
	isSignUpSuccess: boolean;
	isForgotSuccess: boolean;
	handleSignUp: (payload: SignUpPayload) => Promise<void>;
	handleSignIn: (payload: LoginPayload) => Promise<void>;
	handleForgotPassword: (payload: SendResetLinkPayload) => Promise<void>;
	handleUpdatePassword: (payload: UpdatePasswordPayload) => Promise<void>;
	handleLogout: () => Promise<void>;
	clearError: () => void;
	reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: JSON.parse(localStorage.getItem('user') || 'null'),
	isLoading: false,
	error: null,
	isSignUpSuccess: false,
	isForgotSuccess: false,
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
			window.location.href = '/project'
		} catch (error: any) {
			const message = error.response?.data?.error_description || error.message || 'Login failed.';
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},
	handleLogout: async () => {
		set({ isLoading: true, error: null });
		try {
			await logout();
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			localStorage.removeItem('user');
			window.location.href = '/login';
		} catch (error: any) {
			const message = error.response?.data?.msg || error.message || 'Failed to logout.';
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},
	handleForgotPassword: async (payload) => {
		set({
			isLoading: true,
			error: null,
			isForgotSuccess: false,
		});
		try {
			await sendResetLink(payload);
			set({
				isForgotSuccess: true,
			})
		} catch (error) {
			const message = error.response?.data?.error_description || error.message || 'Failed to send reset link.';
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},
	handleUpdatePassword: async (payload) => {
		set({
			isLoading: true,
			error: null,
		});

		try {
			await updatePassword(payload);
			localStorage.clear();
			window.location.href = '/login';
		} catch (error: any) {
			const message = error.response?.data?.error_description || error.message || 'Failed to update password.';
			set({ error: message });
		} finally {
			set({ isLoading: false });
		}
	},
	clearError: () => set({ error: null }),
	reset: () => set({ isLoading: false, error: null, isSignUpSuccess: false }),
}));