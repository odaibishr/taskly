import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from '../validation';
import type { z } from 'zod';
import { useAuthStore } from '../store/auth.store';
import FormContainer from '../../../shared/components/FormContainer';
import HeaderSection from './HeaderSection';

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
	const { isLoading, error, isSignUpSuccess, handleSignUp, clearError } = useAuthStore();

	const { register, handleSubmit, formState: { errors }, reset } = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
	});

	const onSubmit = async (data: SignUpFormData) => {
		await handleSignUp({
			email: data.email,
			password: data.password,
			data: {
				name: data.name,
				department: data.department,
			},
		});
	}

	return (
		<FormContainer>
			<HeaderSection
				title="Create your workspace"
				description="Join the editorial approach to task management."
			/>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input {...register("name")} placeholder="Name" />
				{errors.name && <span>{errors.name.message}</span>}

				<input {...register("email")} placeholder="Email" />
				{errors.email && <span>{errors.email.message}</span>}

				<input {...register("department")} placeholder="Department" />
				{errors.department && <span>{errors.department.message}</span>}

				<input type="password" {...register("password")} placeholder="Password" />
				{errors.password && <span>{errors.password.message}</span>}

				<input type="password" {...register("confirmPassword")} placeholder="Confirm Password" />
				{errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

				<button type="submit" disabled={isLoading}>Sign Up</button>
				{error && <span>{error}</span>}
			</form>
		</FormContainer>
	);
}