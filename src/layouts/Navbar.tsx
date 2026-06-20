import { LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";

import Logo from "@/assets/Logo.svg";
import { useAuthStore } from "@/features/auth";
import { getInitials } from "@/shared/lib/utils";

export default function Navbar() {
	const { user, handleLogout } = useAuthStore();
	const location = useLocation();

	const userName = user?.user_metadata?.name || "User";
	const userRole = user?.user_metadata?.department || "Member";
	const userAvatar = getInitials(userName);

	return (
		<>
			{!location.pathname.includes('project') ? (
				<nav className="w-full bg-white mb-15">
					<div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
						<img src={Logo} alt="Taskly Logo" className="h-7 mr-2" />
					</div>
				</nav>
			) : (
				<header className="h-20 bg-white border-b border-gray-100 sticky top-0 z-30 px-6 lg:px-10">
					<div className="h-full flex justify-end items-center max-w-400 mx-auto">
						<div className="flex items-center gap-4">
							<div className="text-right hidden sm:block">
								<h4 className="text-[#0F172A] font-bold text-sm leading-tight capitalize">
									{userName}
								</h4>
								<p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">
									{userRole}
								</p>
							</div>
							<div className="w-10 h-10 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-200">
								{userAvatar}
							</div>
							<button
								onClick={() => handleLogout()}
								className="lg:hidden w-10 h-10 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 shadow-md shadow-red-100 transition-colors cursor-pointer"
								title="Logout"
							>
								<LogOut size={18} />
							</button>
						</div>
					</div>
				</header>
			)}
		</>
	);
}
