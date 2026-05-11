import Breadcrumbs from "./Breadcrumbs";
import { useLocation } from "react-router-dom";

export const HeaderSection = ({ children }: { children?: React.ReactNode }) => {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);
	const currentPath = pathnames[pathnames.length - 1] || "Dashboard";

	const pageTitle = currentPath.replace(/-/g, " ");

	return (
		<section className="flex flex-col gap-2 mb-8">
			<Breadcrumbs />
			<div className="flex justify-between items-center gap-5">
				<h1 className="text-3xl font-bold capitalize">
					{pageTitle}
				</h1>
				{children}
			</div>
		</section>
	);
};
