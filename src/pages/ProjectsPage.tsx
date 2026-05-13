import { useEffect } from "react";
import EmptyProjects from "../features/projects/components/EmptyProjects"
import { useProjecteStore } from "../features/projects/store/projects.store"
import Button from "../shared/components/Button";
import { HeaderSection } from "../shared/components/HeaderSection";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../features/projects/components/ProjectCard";
import ProjectSkeleton from "../features/projects/components/ProjectSkeleton";
import Pagination from "../features/projects/components/Pagination";
import { CloudOff } from "lucide-react";

const ProjectsPage = () => {
	const { projects, getProjects, isLoading, error } = useProjecteStore();
	const navigate = useNavigate();

	useEffect(() => {
		getProjects();
	}, [getProjects]);

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
			<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
				{isLoading
					? Array.from({ length: 6 }, (_, index) => <ProjectSkeleton key={index} />)
					: projects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
			</section>

			{/* Pagination UI */}
			{!isLoading && projects.length > 0 && (
				< Pagination />
			)}
		</main >
	)
}

export default ProjectsPage