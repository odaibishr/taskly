import { useEffect } from "react";
import EmptyProjects from "../features/projects/components/EmptyProjects"
import { useProjecteStore } from "../features/projects/store/projects.store"
import Button from "../shared/components/Button";

const ProjectsPage = () => {
	const { projects, getProjects, isLoading, error } = useProjecteStore();

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

		</main>
	)
}

export default ProjectsPage 