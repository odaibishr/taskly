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

export interface FormsFields {
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