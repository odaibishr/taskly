import { useState } from "react";
import Epics from '../../assets/Epics.svg';
import Folder from '../../assets/Folder.svg';
import Tasks from '../../assets/Tasks.svg';
import Users from '../../assets/Users.svg';
import Info from '../../assets/Info.svg';
import Menu from '../../assets/MenuIcon.svg';
import type { MenuItem } from "../types/types";
import { useAuthStore } from "../../features/auth/store/auth.store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import Logo from "../../assets/Icon.svg";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";


const menuItems: MenuItem[] = [
	{
		id: 1,
		icon: Folder,
		label: 'Projects',
		herf: '/dashboard/projects',
	},
	{
		id: 2,
		icon: Epics,
		label: 'Project Epics',
		herf: '/dashboard/project-epics',
	},

	{
		id: 3,
		icon: Tasks,
		label: 'Project Tasks',
		herf: '/dashboard/project-tasks',
	},
	{
		id: 4,
		icon: Users,
		label: 'Project Members',
		herf: '/dashboard/project-members',
	},
	{
		id: 5,
		icon: Info,
		label: 'Project Details',
		herf: '/dashboard/project-details',
	},
];

interface Props {
	isCollapsed: boolean;
	setIsCollapsed: (isCollapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: Props) {
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const { reset } = useAuthStore();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const handleLogout = () => {
		reset();
		navigate('/login');
	}

	return (
		<>
			{!isMobileOpen && (
				<button
					onClick={() => setIsMobileOpen(true)}
					className={cn(
						"lg:hidden fixed top-0 left-0 z-60",
						"h-20 w-16 bg-white flex items-center justify-center", // نفس ارتفاع النافبار
						"border-b border-r border-gray-100 shadow-sm" // ليتماشى مع خطوط النافبار
					)}
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

				<nav className="flex-1 py-6 space-y-2">
					{menuItems.map((item) => (
						<Link key={item.id}
							to={item.herf}
							className={cn(
								"flex items-center p-3 rounded-lg transition-colors hover:bg-white hover:shadow-sm group cursor-pointer",
								isCollapsed ? "justify-center" : "justify-start",
								pathname === item.herf && "bg-white text-primary-foreground",
							)}
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
						onClick={handleLogout}
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