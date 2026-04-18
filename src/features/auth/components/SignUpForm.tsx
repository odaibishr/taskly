import { useState, type FormEvent } from "react";
import { useAuthStore } from "../store/auth.store";
import { Link } from 'react-router-dom';
import type { FormFields, FormErrors } from "../types";

function validate(fields: FormFields): FormErrors {
	const errors: FormErrors = {};
	if (!fields.name.trim()) {
		errors.name = 'Name is required';
	}
	if (!fields.email.trim()) {
		errors.email = 'Email is required';
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
		errors.email = 'Invalid email format';
	}
	if (!fields.department.trim()) {
		errors.department = 'Department is required';
	}
	if (!fields.password) {
		errors.password = 'Password is required';
	} else if (fields.password.length < 8) {
		errors.password = 'Password must be at least 8 characters';
	} else if (!/[A-Z]/.test(fields.password)) {
		errors.password = 'Password must contain an uppercase letter';
	} else if (!/[!@#$%^&*(),.?":{}|<>]/.test(fields.password)) {
		errors.password = 'Password must contain a special character';
	}
	if (fields.password !== fields.confirmPassword) {
		errors.confirmPassword = 'Passwords do not match';
	}
	return errors;
}

export function SignUpForm() {
	const { isLoading, error, isSignUpSuccess, handleSignUp, clearError } = useAuthStore();
	const [fields, setFields] = useState<FormFields>({
		name: '',
		email: '',
		department: '',
		password: '',
		confirmPassword: '',
	});
	const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
	const [showPassword, setShowPassword] = useState(false);
}
