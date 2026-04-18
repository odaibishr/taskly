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