import { Edit } from "lucide-react";
import Button from "../../../shared/components/Button";
import type { Project } from "../types";
import { useNavigate } from "react-router-dom";

interface CardProjectProps {
	project: Project;
}

const ProjectCard = ({ project }: CardProjectProps) => {
	const navigate = useNavigate();

	return (
		<div className="bg-white hover:shadow-sm/10 transition-all duration-300 min-h-[220px] rounded-lg flex flex-col justify-between p-6">
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-bold text-slate-dark leading-7">{project.name}</h2>
					<Button
						variant="ghost"
						onClick={(e: React.MouseEvent) => {
							e.stopPropagation();
							navigate(`/project/${project.id}/edit`)
						}}
					>
						<Edit size={16} />
					</Button>
				</div>
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