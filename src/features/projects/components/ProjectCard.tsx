import type { Project } from "../types";

interface CardProjectProps {
	project: Project;
}

const ProjectCard = ({ project }: CardProjectProps) => {
	return (
		<div className="bg-white min-h-[220px] rounded-lg flex flex-col justify-between p-6">
			<div className="space-y-2">
				<h2 className="text-lg font-bold text-slate-dark leading-7">{project.name}</h2>
				<p className="text-slate-medium line-clamp-4">{project.description}</p>
			</div>

			<div className="flex justify-between items-center gap-4">
				<span className="uppercase text-[#737685] text-[11px] font-bold">Created At</span>
				<p className="text-[#041B3C] text-[12px] font-medium">{new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
			</div>
		</div>
	)
}

export default ProjectCard