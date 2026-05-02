export interface SignUpPayload {
	email: string;
	password: string;
	data: {
		name: string;
		department: string;
	};
}

export interface AuthError {
	message: string;
	status: number;
}

export interface FormFields {
	name: string;
	email: string;
	department: string;
	password: string;
	confirmPassword: string;
}	

export interface FormErrors {
	name?: string;
	email?: string;
	department?: string;
	password?: string;
	confirmPassword?: string;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface AuthResponse {
	access_token: string;
	refresh_token: string;
	user: {
		id: string;
		email: string;
		user_metadata: {
			name: string;
			department: string;
		};
	};
}