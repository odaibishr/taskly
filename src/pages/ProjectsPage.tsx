import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
	useProjectsStore,
	ProjectCard,
	ProjectSkeleton,
	Pagination,
	EmptyProjects
} from "@/features/projects";
import { useProjectsPage } from "@/features/projects/hooks/useProjectsPage";
import Button from "@/shared/components/Button";
import ErrorCard from "@/shared/components/ErrorCard";
import { HeaderSection } from "@/shared/components/HeaderSection";
import { ROUTES } from "@/shared/lib/routes";

const ProjectsPage = () => {
	const { isLoading } = useProjectsStore();
	const { projects, error, getProjects, observerTarget, handleProjectClick } = useProjectsPage();
	const navigate = useNavigate();

	if (error) {
		return <ErrorCard retryAction={() => getProjects()} />;
	}

	if (!isLoading && !error && projects.length === 0) {
		return <EmptyProjects />;
	}

	return (
		<main>
			<HeaderSection
				title="Projects"
				description="Manage and curate your projects"
				isBreadcrumbVisible={false}
			>
				{isLoading ? (
					<div className="max-md:hidden w-50 h-12 bg-gray-200 rounded-lg animate-pulse" />
				) : (
					<Button
						className="max-md:hidden flex items-center gap-2"
						onClick={() => navigate(ROUTES.CREATE_PROJECT)}
					>
						<PlusCircle />
						Create Project
					</Button>
				)}
			</HeaderSection>

			{!isLoading && projects.length > 0 && (
				<div className="fixed bottom-4 right-4 md:hidden">
					<Button
						className="rounded-full bg-white hover:bg-white w-14 h-14 p-0 flex items-center justify-center shadow-lg"
						onClick={() => navigate(ROUTES.CREATE_PROJECT)}
					>
						<PlusCircle className="text-white" size={26} />
					</Button>
				</div>
			)}

			<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
				{isLoading
					? Array.from({ length: 6 }, (_, index) => <ProjectSkeleton key={index} />)
					: projects.map((project) => (
						<div key={project.id} className="cursor-pointer" onClick={() => handleProjectClick(project.id)}>
							<ProjectCard project={project} />
						</div>
					))}
			</section>

			<div ref={observerTarget} className="h-10 md:hidden" />
			<div className="max-md:hidden">
				<Pagination />
			</div>
		</main>
	);
};

export default ProjectsPage;
