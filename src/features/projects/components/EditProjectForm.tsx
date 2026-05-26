import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";

import FormHeader from "@/features/projects/components/FormHeader";
import { useProjectsStore } from "@/features/projects/store/projects.store";
import { createProjectSchema } from "@/features/projects/validation";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import Textarea from "@/shared/components/Textarea";
import { ROUTES } from "@/shared/lib/routes";


type EditProjectFormData = z.infer<typeof createProjectSchema>;


const EditProjectForm = () => {
	const navigate = useNavigate();
	const { projectId } = useParams<{ projectId: string }>();
	const {
		currentProject,
		getProjectById,
		updateProject,
		error,
		isLoading
	} = useProjectsStore();
	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors }
	} = useForm<EditProjectFormData>({
		resolver: zodResolver(createProjectSchema),
	});

	useEffect(() => {
		if (currentProject) {
			reset({
				name: currentProject.name,
				description: currentProject.description || ""
			});
		}
	}, [currentProject, reset]);

	useEffect(() => {
		if (projectId) {
			getProjectById(projectId);
		}
	}, [projectId, getProjectById]);

	const onSubmit = async (data: EditProjectFormData) => {
		if (!projectId) return;
		await updateProject(projectId, data);
		navigate(ROUTES.PROJECTS);
	};
	if (isLoading && !currentProject) {
		return <div className="text-center mt-20">Loading project details...</div>;
	}
	return (
		<section className="flex items-center justify-center mt-16">
			<div className="bg-white w-[80%] rounded-lg shadow-[0px_24px_48px_0px_#041B3C0F]">
				<FormHeader
					title="Edit Project"
					description="Update the details of your existing project."
					icon={<Edit className="text-primary-container" color="#003D9B" size={32} />}
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
						// eslint-disable-next-line react-hooks/incompatible-library
						value={watch('description')}
					/>
					<div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
						<Button
							type="button"
							variant="ghost"
							onClick={() => navigate('/project')}
							className="w-full sm:w-fit px-8"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="primary"
							className="sm:min-w-40"
							disabled={isLoading}
						>
							Save Changes
						</Button>
					</div>
					{error && (
						<div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md text-center mt-4">
							{error}
						</div>
					)}
				</form>
			</div>
		</section>
	);
};

export default EditProjectForm;