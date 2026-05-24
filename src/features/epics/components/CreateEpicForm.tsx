import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEpicsStore } from "@/features/epics/store/epics.store";
import { createEpicSchema } from "@/features/epics/validation";
import { useProjectMembers } from "@/features/members/hooks/useProjectMembers";
import type { ProjectMember } from "@/features/members";
import FormHeader from "@/features/projects/components/FormHeader";
import { Layers } from "lucide-react";
import Input from "@/shared/components/Input";
import Textarea from "@/shared/components/Textarea";
import Select from "@/shared/components/Select";
import Button from "@/shared/components/Button";

type CreateEpicFormData = z.infer<typeof createEpicSchema>;

export default function CreateEpicForm() {
	const navigate = useNavigate();
	const { projectId } = useParams<{ projectId: string }>();
	const { createEpic, isLoading, error } = useEpicsStore();
	const { members } = useProjectMembers();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<CreateEpicFormData>({
		resolver: zodResolver(createEpicSchema),
		defaultValues: {
			title: "",
			description: "",
			assignee_id: "",
			deadline: "",
		}
	});

	const onSubmit = async (data: CreateEpicFormData) => {
		if (!projectId) return;

		await createEpic({
			title: data.title,
			description: data.description || null,
			assignee_id: data.assignee_id || null,
			project_id: projectId,
			deadline: data.deadline || null,
		});

		navigate(`/project/${projectId}/epics`);
	};

	const memberOptions = members.map((member) => {
		const m = member as ProjectMember & { full_name?: string };
		const name = m.name || m.full_name || m.email.split('@')[0];
		return {
			value: member.id,
			label: `${name} (${member.role})`,
		};
	});

	return (
		<section className="flex items-center justify-center mt-16">
			<div className="bg-white w-[80%] rounded-lg shadow-[0px_24px_48px_0px_#041B3C0F]">
				<FormHeader
					title="Create New Epic"
					description="Group your project tasks under a broader strategic objective."
					icon={<Layers className="text-primary-container" color="#003D9B" size={32} />}
				/>

				<form onSubmit={handleSubmit(onSubmit)} className="p-8">
					<Input
						name="title"
						placeholder="Enter epic title"
						register={register}
						error={errors.title}
						label="Epic Title"
					/>

					<Textarea
						name="description"
						placeholder="Enter epic description"
						register={register}
						error={errors.description}
						label="Epic Description"
						maxLength={500}
						optional
						// eslint-disable-next-line react-hooks/incompatible-library
						value={watch('description')}
					/>

					<Select
						name="assignee_id"
						placeholder="Unassigned"
						register={register}
						options={memberOptions}
						error={errors.assignee_id}
						label="Assignee"
						optional
					/>

					<Input
						name="deadline"
						type="date"
						placeholder="Select deadline"
						register={register}
						error={errors.deadline}
						label="Deadline"
					/>

					<div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
						<Button
							type="button"
							variant="ghost"
							onClick={() => navigate(`/project/${projectId}/epics`)}
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
							Create
						</Button>
					</div>

					{error && (
						<div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md text-center">
							{error}
						</div>
					)}
				</form>
			</div>
		</section>
	);
}
