import type z from "zod";
import { resetPasswordSchema } from "../validation";
import { useAuthStore } from "../store/auth.store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormContainer from "../../../shared/components/FormContainer";
import HeaderSection from "./HeaderSection";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
	const { isLoading, handleUpdatePassword } = useAuthStore();
	const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema)
	});

	const onSubimt = async (data: ResetPasswordFormData) => {
		await handleUpdatePassword(data);
	}

	return (
		<FormContainer>
			<HeaderSection
				title="Create a New Password"
				description="Create a new, strong password to secure your workstation access."
			/>
		</FormContainer>
	)
}