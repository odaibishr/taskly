import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, CloudOff } from "lucide-react";
import {
	useProjecteStore,
	ProjectCard,
	ProjectSkeleton,
	Pagination,
	EmptyProjects
} from "../features/projects";
import { HeaderSection } from "../shared/components/HeaderSection";
import Button from "../shared/components/Button";

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
	}, [projects.length, isLoading]);

	const handleProjectClick = (projectId: string) => {
		navigate(`/project/${projectId}/epics`);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in duration-300">
				<div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
					<CloudOff className="text-red-500" size={32} />
				</div>
				<h2 className="text-xl font-bold text-[#0F172A] mb-2">
					Something went wrong
				</h2>
				<p className="text-[#64748B] max-w-[320px] mb-8 leading-relaxed">
					We're having trouble retrieving your projects right now. Please try again in a moment.
				</p>
				<Button
					className="bg-[#0052CC] hover:bg-[#003D9B] px-10 py-3 rounded-md shadow-lg shadow-blue-100 transition-all active:scale-95"
					onClick={() => getProjects()}
				>
					Retry Connection
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