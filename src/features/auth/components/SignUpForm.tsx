import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from '../validation';
import type { z } from 'zod';
import { useAuthStore } from '../store/auth.store';
import FormContainer from '../../../shared/components/FormContainer';
import HeaderSection from './HeaderSection';
import Input from './Input';
import Button from '../../../shared/components/Button';

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
				<Input
					register={register}
					name="name"
					placeholder="Name"
					label="Name"
					error={errors.name}
				/>

				<Input
					register={register}
					name="email"
					placeholder="Email"
					label="Email"
					error={errors.email}
				/>

				<Input
					register={register}
					name="department"
					placeholder="Department"
					label="Department"
					error={errors.department}
				/>

				<Input
					register={register}
					name="password"
					placeholder="Password"
					type="password"
					label="Password"
					error={errors.password}
				/>

				<Input
					register={register}
					name="confirmPassword"
					placeholder="Confirm Password"
					type="password"
					label="Confirm Password"
					error={errors.confirmPassword}
				/>

				<Button
					type="submit"
					disabled={isLoading}
				>
					Sign Up
				</Button>

				{error && <span>{error}</span>}
			</form>
		</FormContainer>
	);
}