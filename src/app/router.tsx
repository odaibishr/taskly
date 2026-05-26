import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";
import Navbar from "@/layouts/Navbar";
import CreateEpicPage from "@/pages/CreateEpicPage";
import CreateProjectPage from "@/pages/CreateProjectPage";
import EditProjectPage from "@/pages/EditProjectPage";
import EpicsPage from "@/pages/EpicsPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import LogInPage from "@/pages/LogInPage";
import ProjectMembersPage from "@/pages/ProjectMembersPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import SignUpPage from "@/pages/SignUpPage";
import { ToastContainer } from "@/shared/components/ToastContainer";
import { useRecoveryRedirect } from "@/shared/hooks/recoveryRedirect";

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
	return (
		<>
			<RouterProvider router={router} />
			<ToastContainer />
		</>
	);
}