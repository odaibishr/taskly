import type z from "zod";
import { loginSchema } from "../validation";
import { useAuthStore } from "../store/auth.store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormContainer from "../../../shared/components/FormContainer";
import HeaderSection from "./HeaderSection";
import Input from "./Input";
import Button from "../../../shared/components/Button";
import { Link } from "react-router-dom";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
	const { isLoading, error, handleSignIn } = useAuthStore();
	const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubimt = async (data: LoginFormData) => {
		await handleSignIn(data);
	}

	return (
		<FormContainer>
			<HeaderSection
				title="Welcome Back"
				description="Please enter your details to access your workspace" />

			<form onSubmit={handleSubmit(onSubimt)} className="space-y-4">
				<Input
					register={register}
					name="email"
					placeholder="Email"
					label="Email"
					error={errors.email}
				/>

				<Input
					register={register}
					name="password"
					placeholder="Password"
					type="password"
					label="Password"
					error={errors.password}
				/>


				<div className="flex items-center justify-between">
					<label htmlFor="remember" className="flex items-center space-x-2">
						<input type="checkbox" id="remember" />
						<span>Remember me</span>
					</label>
					<Link to='/reset-password' className="text-blue-500 text-sm">Forgot password?</Link>
				</div>

				<Button
					type="submit"
					disabled={isLoading}
					className="w-full"
				>
					{isLoading ? 'Signing in...' : 'Sign In'}
				</Button>

				{error && (
					<div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md text-center">
						{error}
					</div>
				)}

				<hr className="mt-5 mb-8 border-slate-200" />

				<div className="flex items-center justify-center">
					<span className="text-sm text-slate-medium">Don't have an account?</span>
					<Link to='/signup' className="text-blue-500 text-sm ml-2">Sign Up</Link>
				</div>
			</form>

		</FormContainer>
	)
}

