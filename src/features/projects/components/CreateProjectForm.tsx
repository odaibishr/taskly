import z from "zod";
import { createProjectSchema } from "../validation"
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProjecteStore } from "../store/projects.store";

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

const CreateProjectForm = () => {
	const navigate = useNavigate();
	const {
		createProject,
		isLoading,
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
			console.error(error.message)
		}
	};

	return (
		<div>CreateProjectForm</div>
	)
}

export default CreateProjectForm