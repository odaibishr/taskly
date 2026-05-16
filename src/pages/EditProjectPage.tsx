import { HeaderSection } from "../shared/components/HeaderSection";
import { EditProjectForm } from "../features/projects";

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