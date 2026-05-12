import z from "zod";
import { createProjectSchema } from "../validation"
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProjecteStore } from "../store/projects.store";
import FormHeader from "./FormHeader";
import { CheckCircle } from "lucide-react";
import Input from "../../../shared/components/Input";
import Textarea from "../../../shared/components/Texterea";
import Button from "../../../shared/components/Button";
import { useAuthStore } from "../../auth/store/auth.store";

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

const CreateProjectForm = () => {
	const navigate = useNavigate();
	const {
		createProject,
		error,
		isLoading
	} = useProjecteStore();

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<CreateProjectFormData>({
		resolver: zodResolver(createProjectSchema),
	});

	const onSubmit = async (data: CreateProjectFormData) => {
		try {
			const user = useAuthStore.getState().user;
			if (!user) throw new Error("User not authenticated");
			await createProject({ ...data, created_by: user.id });
			navigate('/dashboard/projects');
		} catch (error: any) {
			console.error(error.message);
		}
	};

	return (
		<section className="flex items-center justify-center mt-16">
			<div className="bg-white w-[80%] rounded-lg shadow-[0px_24px_48px_0px_#041B3C0F]">
				<FormHeader
					title="Initialize New Project"
					description="Define the scope and foundational details of your project."
					icon={<CheckCircle className="text-primary-container" color="#003D9B" size={32} />}
				/>

				<form onSubmit={handleSubmit(onSubmit)} className="p-8">
					<Input
						name="name"
						placeholder="Enter project title"
						register={register}
						error={errors.name}
						label="Project Name"
					/>
					<br />
					<Textarea
						name="description"
						placeholder="Enter project description"
						register={register}
						error={errors.description}
						label="Project Description"
						maxLength={500}
						optional
					/>

					<div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
						<Button
							type="button"
							variant="ghost"
							onClick={() => navigate('/dashboard/projects')}
							className="w-full sm:w-fit px-8"
						>
							Back
						</Button>
						<Button
							type="submit"
							variant="primary"
							className="sm:min-w-[160px]"
							disabled={isLoading}
						>
							Create Project
						</Button>
					</div>

					{error && (
						<div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md text-center">
							{error}
						</div>
					)}

				</form>

				<div className="bg-surface-low shadow-sm p-6 flex items-start gap-3 border-t border-blue-50 rounded-b-lg">
					<div className="text-blue-500 mt-0.5">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
					</div>
					<p className="text-[12px] text-slate-500 leading-relaxed">
						<strong className="text-slate-700">Pro Tip:</strong> You can invite project members and assign epics immediately after the initial creation process.
					</p>
				</div>
			</div>
		</section>
	)
}

export default CreateProjectForm