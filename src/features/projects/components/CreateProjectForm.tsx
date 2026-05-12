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

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

const CreateProjectForm = () => {
	const navigate = useNavigate();
	const {
		createProject,
		error
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
			await createProject(data);
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

					<div className="pt-6 flex items-center justify-between gap-4">
						<Button
							type="button"
							variant="ghost"
							onClick={() => navigate('/dashboard/projects')}
							className="px-8"
						>
							Back
						</Button>

						<Button
							type="submit"
							variant="primary"
							className="min-w-[160px]"
						>
							Create Project
						</Button>
					</div>

				</form>
			</div>


		</section>
	)
}

export default CreateProjectForm