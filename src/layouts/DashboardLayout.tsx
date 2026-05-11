import { useState } from "react";
import Navbar from "../shared/components/Navbar";
import Sidebar from "../shared/components/Sidebar";
import { cn } from "../shared/lib/utils";
import { useAuthStore } from "../features/auth/store/auth.store";
import { Navigate } from "react-router-dom";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
	const { user } = useAuthStore();

	if (!user) {
		return <Navigate to="/login" replace />;
	}


	return (
		<div className="min-h-screen flex">

			<Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

			<div className={cn(
				"flex-1 flex flex-col transition-all duration-300",
				isCollapsed ? "lg:pl-20" : "lg:pl-64"
			)}>
				<Navbar />

				<main className="p-6 lg:p-10 flex-1">
					<div className="max-w-[1600px] mx-auto">
						{children}
					</div>
				</main>
			</div>
		</div>
	)
}