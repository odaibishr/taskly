import { useEffect } from "react";
import EmptyProjects from "../features/projects/components/EmptyProjects"
import { useProjecteStore } from "../features/projects/store/projects.store"
import Button from "../shared/components/Button";
import { HeaderSection } from "../shared/components/HeaderSection";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectsPage = () => {
	const { projects, getProjects, isLoading, error } = useProjecteStore();
	const navigate = useNavigate();

	useEffect(() => {
		getProjects();
	}, [getProjects]);

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
				<div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 max-w-md">
					<h3 className="font-bold text-lg mb-1">Error Loading Projects</h3>
					<p>{error}</p>
				</div>
				<Button variant="secondary" onClick={() => getProjects()}>
					Try Again
				</Button>
			</div>
		);
	}

	if (!isLoading && !error && projects.length === 0) {
		return <EmptyProjects />
	}

	return (
		<main>
			{/* Header Section */}
			<HeaderSection
				title="Projects"
				description="Manage and curate your projects"
				isBreadcrumbVisible={false}
			>
				<Button className="max-md:hidden flex items-center gap-2">
					<PlusCircle />
					Create Project
				</Button>
			</HeaderSection>

			{/* Floating Action Button for mobile */}
			<div className="fixed bottom-4 right-4 md:hidden">
				<Button
					className="rounded-full bg-white hover:bg-white w-14 h-14 p-0 flex items-center justify-center shadow-lg"
					onClick={() => navigate('/dashboard/projects/create-project')}
				>
					<PlusCircle className="text-white" size={26} />
				</Button>
			</div>
		</main>
	)
}

export default ProjectsPage