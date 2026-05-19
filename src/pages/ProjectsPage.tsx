import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import {
	useProjecteStore,
	ProjectCard,
	ProjectSkeleton,
	Pagination,
	EmptyProjects
} from "../features/projects";
import { HeaderSection } from "../shared/components/HeaderSection";
import Button from "../shared/components/Button";
import ErrorCard from "../shared/components/ErrorCard";

const ProjectsPage = () => {
	const { projects, getProjects, isLoading, error, pagination } = useProjecteStore();
	const navigate = useNavigate();
	const observerTarget = useRef<HTMLDivElement>(null);

	useEffect(() => {
		getProjects();
	}, [getProjects]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !isLoading) {
					const { totalCount } = pagination;
					if (projects.length < totalCount) {
						useProjecteStore.setState((s) => ({
							pagination: { ...s.pagination, currentPage: s.pagination.currentPage + 1 }
						}));
						getProjects(true);
					}
				}
			},
			{ threshold: 1.0 }
		);
		if (observerTarget.current) observer.observe(observerTarget.current);
		return () => observer.disconnect();
	}, [projects.length, isLoading, pagination, getProjects]);

	const handleProjectClick = (projectId: string) => {
		navigate(`/project/${projectId}/epics`);
	}

	if (error) {
		return (
			<ErrorCard
				retryAction={() => getProjects()}
			/>
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
				{isLoading ? (
					<div className="max-md:hidden w-50 h-12 bg-gray-200 rounded-lg animate-pulse" />
				) : (
					<Button
						className="max-md:hidden flex items-center gap-2"
						onClick={() => navigate('/dashboard/projects/create-project')}
					>
						<PlusCircle />
						Create Project
					</Button>
				)}
			</HeaderSection>

			{/* Floating Action Button for mobile */}
			{
				!isLoading && projects.length > 0 && (
					<div className="fixed bottom-4 right-4 md:hidden">
						<Button
							className="rounded-full bg-white hover:bg-white w-14 h-14 p-0 flex items-center justify-center shadow-lg"
							onClick={() => navigate('/dashboard/projects/create-project')}
						>
							<PlusCircle className="text-white" size={26} />
						</Button>
					</div>
				)
			}

			{/* Projects List */}
			<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
				{isLoading
					? Array.from({ length: 6 }, (_, index) => <ProjectSkeleton key={index} />)
					: projects.map((project) => (
						<div className="cursor-pointer" onClick={() => handleProjectClick(project.id)}>
							<ProjectCard key={project.id} project={project} />
						</div>
					))}
			</section>

			{/* Pagination UI */}
			{/* Infinite Scroll (Mobile Only) */}
			<div ref={observerTarget} className="h-10 md:hidden" />
			{/* Pagination UI (Desktop Only) */}
			<div className="max-md:hidden">
				<Pagination />
			</div>
		</main >
	)
}

export default ProjectsPage