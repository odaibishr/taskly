import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import { useRecoveryRedirect } from "@/shared/hooks/recoveryRedirect";
import Navbar from "@/layouts/Navbar";

import SignUpPage from "@/pages/SignUpPage";
import LogInPage from "@/pages/LogInPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProjectsPage from "@/pages/ProjectsPage";
import CreateProjectPage from "@/pages/CreateProjectPage";
import EditProjectPage from "@/pages/EditProjectPage";
import ProjectMembersPage from "@/pages/ProjectMembersPage";
import CreateEpicPage from "@/pages/CreateEpicPage";
import EpicsPage from "@/pages/EpicsPage";

function RootLayout() {
	useRecoveryRedirect();
	return (
		<>
			<Navbar />
			<Outlet />
		</>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{ index: true, element: <Navigate to="/login" replace /> },
			{ path: "/signup", element: <SignUpPage /> },
			{ path: "/login", element: <LogInPage /> },
			{ path: "/forget-password", element: <ForgotPasswordPage /> },
			{ path: "/reset-password", element: <ResetPasswordPage /> },
		],
	},
	{
		path: "/project",
		element: (
			<DashboardLayout>
				<Outlet />
			</DashboardLayout>
		),

		children: [
			{
				index: true,
				element: <ProjectsPage />,
			},
			{
				path: "create-project",
				element: <CreateProjectPage />,
			},
			{
				path: ":projectId",
				children: [
					{ path: "epics", element: <EpicsPage /> },
					{ path: "epics/new", element: <CreateEpicPage /> },
					{ path: "tasks", element: <div>Tasks Page Content</div> },
					{ path: "members", element: <ProjectMembersPage /> },
					{ path: "edit", element: <EditProjectPage /> },
				]
			}
		]
	},
]);

export function AppRouter() {
	return <RouterProvider router={router} />;
}