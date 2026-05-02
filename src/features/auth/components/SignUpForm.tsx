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

	if (isSignUpSuccess) {
		return (
			<FormContainer>
				<div className="text-center py-8">
					<div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
					<p className="text-gray-600 mb-6">
						We've sent a confirmation link to your email address. Please click it to activate your account.
					</p>
					<Button onClick={() => window.location.href = '/login'}>
						Go to Login
					</Button>
				</div>
			</FormContainer>
		);
	}

	return (
		<FormContainer>
			<HeaderSection
				title="Create your workspace"
				description="Join the editorial approach to task management."
			/>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
					className="w-full"
				>
					{isLoading ? 'Creating account...' : 'Sign Up'}
				</Button>

				{error && (
					<div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md text-center">
						{error}
					</div>
				)}
			</form>
		</FormContainer>
	);
}