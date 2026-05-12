import Breadcrumbs from "./Breadcrumbs";
import { useLocation } from "react-router-dom";

interface Props {
	title?: string;
	description?: string;
	children?: React.ReactNode;
}

export const HeaderSection = ({ title, description, children }: Props) => {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);
	const currentPath = pathnames[pathnames.length - 1] || "Dashboard";

	const pageTitle = currentPath.replace(/-/g, " ");

	return (
		<section className="flex flex-col gap-2 mb-8">
			<Breadcrumbs />
			<div className="flex justify-between items-center gap-5">
				<div className="flex flex-col gap-1">
					<h1 className="text-3xl font-bold capitalize">
						{title ? title : pageTitle}
					</h1>
					{description && <p className="text-gray-500">{description}</p>}
				</div>
				{children}
			</div>
		</section>
	);
};
