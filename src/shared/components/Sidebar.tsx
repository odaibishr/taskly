import { useState } from "react";
import Epics from '../../assets/Epics.svg';
import Folder from '../../assets/Folder.svg';
import Tasks from '../../assets/Tasks.svg';
import Users from '../../assets/Users.svg';
import Info from '../../assets/Info.svg';
import Menu from '../../assets/MenuIcon.svg';
import { useAuthStore } from "../../features/auth/store/auth.store";
import { Link, useLocation, useParams } from "react-router-dom";
import { cn } from "../lib/utils";
import Logo from "../../assets/Icon.svg";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";


interface Props {
	isCollapsed: boolean;
	setIsCollapsed: (isCollapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: Props) {
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const { handleLogout } = useAuthStore();
	const { pathname } = useLocation();
	const { projectId } = useParams();

	const menuItems = projectId ? [
		{ id: 1, icon: Folder, label: 'All Projects', herf: '/project' },
		{ id: 2, icon: Epics, label: 'Epics', herf: `/project/${projectId}/epics` },
		{ id: 3, icon: Tasks, label: 'Tasks', herf: `/project/${projectId}/tasks` },
		{ id: 4, icon: Users, label: 'Members', herf: `/project/${projectId}/members` },
		{ id: 5, icon: Info, label: 'Project Details', herf: `/project/${projectId}/edit` },
	] : [
		{ id: 1, icon: Folder, label: 'Projects', herf: '/project' },
	];

	const handleLogoutClick = async () => {
		await handleLogout();
	}

	return (
		<>
			{!isMobileOpen && (
				<button
					onClick={() => setIsMobileOpen(true)}
					className="lg:hidden fixed top-0 left-0 z-60 h-20 w-16 bg-white flex items-center cursor-pointer justify-center"
				>
					<img
						src={Menu}
						alt="Menu"
						className="w-6 h-6"
					/>
				</button>
			)}
			<aside
				className={cn(
					"fixed left-0 top-0 h-screen bg-surface-low transition-all duration-300 z-50 flex flex-col",
					isCollapsed ? "w-20" : "w-64",
					isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
				)}
			>
				<div className="h-20 flex items-center px-6 border-b border-gray-100">
					<img src={Logo} alt="Logo" className="h-7" />
					{!isCollapsed && (
						<span className="ml-3 font-bold text-xl text-slate-dark">TASKLY</span>
					)}
				</div>

				<nav className="flex-1 mx-4 py-6 space-y-2">
					{menuItems.map((item) => (
						<Link key={item.id}
							to={item.herf}
							className={cn(
								"flex items-center p-3 rounded-lg transition-colors hover:bg-white hover:shadow-sm group cursor-pointer",
								isCollapsed ? "justify-center" : "justify-start",
								pathname === item.herf && "bg-white text-primary-foreground",
							)}
							onClick={() => setIsMobileOpen(!isMobileOpen)}
						>
							<img src={item.icon} alt={item.label} className="h-5 w-5 group-hover:text-primary" />
							{!isCollapsed && <span className="ml-3 font-medium group-hover:text-primary">{item.label}</span>}
						</Link>
					))}
				</nav>

				<div className="p-4 border-t border-gray-100 space-y-2">
					{/* Collapse Toggle */}
					<button
						onClick={() => setIsCollapsed(!isCollapsed)}
						className="hidden lg:flex items-center w-full p-3 rounded-lg hover:bg-white transition-all text-gray-600 cursor-pointer"
					>
						{isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
						{!isCollapsed && <span className="ml-3 font-medium">Collapse</span>}
					</button>
					{/* Logout */}
					<button
						onClick={handleLogoutClick}
						className="flex items-center w-full p-3 rounded-lg hover:bg-red	 text-red-500 cursor-pointer"
					>
						<LogOut size={22} />
						{!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
					</button>
				</div>
			</aside>

			{isMobileOpen && (
				<div
					className="fixed inset-0 bg-black/20 z-40 lg:hidden"
					onClick={() => setIsMobileOpen(false)}
				/>
			)}
		</>

	);


}