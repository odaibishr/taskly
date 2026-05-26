import { EditProjectForm } from "@/features/projects";
import { HeaderSection } from "@/shared/components/HeaderSection";

const EditProjectPage = () => {
	return (
		<main>
			<HeaderSection
				title="Edit Project"
				description="Modify your project details and information."
				isBreadcrumbVisible={true}
			/>
			<EditProjectForm />
		</main>
	);
};

export default EditProjectPage;