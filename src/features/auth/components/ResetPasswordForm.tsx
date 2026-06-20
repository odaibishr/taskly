import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import type z from "zod";

import HeaderSection from "@/features/auth/components/HeaderSection";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { resetPasswordSchema } from "@/features/auth/validation";
import Button from "@/shared/components/Button";
import FormContainer from "@/shared/components/FormContainer";
import Input from "@/shared/components/Input";


type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
	const { isLoading, error, handleUpdatePassword } = useAuthStore();
	const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema)
	});

	const onSubmit = async (data: ResetPasswordFormData) => {
		await handleUpdatePassword({ password: data.password });
	}

	return (
		<FormContainer>
			<HeaderSection
				title="Create a New Password"
				description="Create a new, strong password to secure your workstation access."
			/>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					register={register}
					name="password"
					label="Password"
					type="password"
					placeholder="Password"
					error={errors.password}
				/>

				<Input
					register={register}
					name="confirmPassword"
					label="Confirm Password"
					type="password"
					placeholder="Confirm Password"
					error={errors.confirmPassword}
				/>

				<Button type="submit" disabled={isLoading} className="mt-4">
					Update Password
				</Button>

				<Link to='/login' className="flex items-center justify-center mt-5">
					<span className="text-sm text-primary">Back to sign in</span>
				</Link>

				{error && (
					<div className="p-3 bg-red-50 border border-red-200 text-red-600 mt-5 text-sm rounded-md text-center">
						{error}
					</div>
				)}
			</form>
		</FormContainer>
	)
}