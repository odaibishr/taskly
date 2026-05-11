import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const breadcrumbNameMap: Record<string, string> = {
	dashboard: "Dashboard",
	projects: "Projects",
	create: "Create Project",
	"edit-project": "Edit Project",
	"project-details": "Project Details",
	"project-tasks": "Tasks",
};

const Breadcrumbs = () => {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);
	const displayPathnames = pathnames.filter(x => x !== 'dashboard');

	return (
		<nav className="flex items-center text-sm text-slate-400">
			<ol className="flex items-center space-x-1">

				{displayPathnames.map((value, index) => {
					const last = index === displayPathnames.length - 1;
					const originalIndex = pathnames.indexOf(value);
					const to = `/${pathnames.slice(0, originalIndex + 1).join("/")}`;
					const name = breadcrumbNameMap[value] || value;

					return (
						<li key={to} className="flex items-center capitalize">
							{index > 0 && <ChevronRight size={14} className="mx-1 text-slate-600" />}
							{last ? (
								<span className="font-medium">{name}</span>
							) : (
								<Link to={to} className="hover:text-primary transition-colors">
									{name}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
};

export default Breadcrumbs;
