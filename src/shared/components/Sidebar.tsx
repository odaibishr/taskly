import { useState } from "react";
import ArrawLeft from '../../assets/ArrawLeft.svg';
import Epics from '../../assets/Epics.svg';
import Folder from '../../assets/Folder.svg';
import Tasks from '../../assets/Tasks.svg';
import Users from '../../assets/Users.svg';
import Logout from '../../assets/Logout.svg';
import Info from '../../assets/Info.svg';
import Menu from '../../assets/MenuIcon.svg';
import type { MenuItem } from "../types/types";
import { useAuthStore } from "../../features/auth/store/auth.store";
import { useNavigate } from "react-router-dom";


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

export default function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const { reset } = useAuthStore();
	const navigate = useNavigate();

	const handleLogout = () => {
		reset();
		navigate('/login');
	}

	return (
		<>
			<button
				className="lg:hidden fixed top-5 left-5 z-50 p-2 bg-white rounded-md shadow-md"
				onClick={() => setIsMobileOpen(!isMobileOpen)}
			>
				{!isMobileOpen && <img src={Menu} style={{ width: '20px', height: '20px' }} />}
			</button>
		</>
	);


}