import type z from "zod";
import { forgotPasswordSchema } from "../validation";
import { useAuthStore } from "../store/auth.store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import FormContainer from "../../../shared/components/FormContainer";
import HeaderSection from "./HeaderSection";
import Input from "./Input";
import Button from "../../../shared/components/Button";
import { Link } from "react-router-dom";
import ArrowLeftIcon from '../../../assets/ArrowLeft.svg';
import CeckmarkIcon from '../../../assets/CheckIcon.svg';
import ClockIcon from '../../../assets/ClockIcon.svg';



type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
	const [timer, setTimer] = useState<number>(0);
	const { isLoading, error, handleForgotPassword, clearError } = useAuthStore();
	const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubimt = async (data: ForgotPasswordFormData) => {
		await handleForgotPassword(data);
		setTimer(10);
	}

	useEffect(() => {
		let intervalId: ReturnType<typeof setInterval>;
		if (timer > 0) {
			intervalId = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
		}

		return () => clearInterval(intervalId);
	}, [timer]);

	return (
		<FormContainer>
			<HeaderSection
				title="Forgot password?"
				description="No worries, we'll send you reset instructions."
			/>

			<form onSubmit={handleSubmit(onSubimt)}>
				<Input
					register={register}
					name="email"
					placeholder="Email"
					label="Email"
					error={errors.email}
				/>

				<Button
					type="submit"
					disabled={isLoading || timer > 0}
				>
					Send Reset Link
				</Button>

				<Link to="/login" className="text-blue-500 text-sm flex justify-center my-10 gap-1">
					<img src={ArrowLeftIcon} alt="Back to login" />
					<span>Back to login</span>
				</Link>


				<div className="w-full flex flex-col justify-center items-center gap-6">
					<div className="w-full bg-success p-4 flex gap-3 rounded-lg">
						<img className="w-6 h-6" src={CeckmarkIcon} alt="Checkmark" />
						<span className="text-[#005235] text-sm">If an account exists with this email, we’ve sent a password reset link.</span>
					</div>
					{timer > 0 && (
						<div className="w-full flex flex-col justify-center items-center gap-3">
							<span className="text-[#434654] uppercase text-[11px] font-bold">Didn't receive the email?</span>
							<div className="bg-surface-low w-full rounded-sm flex justify-center items-center p-4 gap-1.5">
								<img className="w-6 h-6" src={ClockIcon} alt="Clock" />
								<button className="text-[#155EEF] text-sm font-semibold">Resend in {timer} </button>
							</div>
						</div>
					)}
				</div>

			</form>
		</FormContainer>
	);
}