import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import App from "../App";

import SignUpPage from "../pages/SignUpPage";
import LogInPage from "../pages/LogInPage";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import DashboardLayout from "../layouts/DashboardLayout";
import Navbar from "../shared/components/Navbar";
import ProjectsPage from "../pages/ProjectsPage";
import CreateProjectPage from "../pages/CreateProjectPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<>
				<Navbar /> {/* سيظهر النافبار هنا لكل الصفحات العامة */}
				<Outlet />
			</>
		),
		children: [
			{ path: "/", element: <App /> },
			{ path: "/signup", element: <SignUpPage /> },
			{ path: "/login", element: <LogInPage /> },
			{ path: "/forget-password", element: <ForgetPassword /> },
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
					{ path: "epics", element: <div>Epics Page Content</div> },
					{ path: "tasks", element: <div>Tasks Page Content</div> },
					{ path: "members", element: <div>Members Page Content</div> },
					{ path: "edit", element: <div>Edit Project Content</div> },
				]
			}
		]
	},
	{
		path: "project-epics",
		element: <div>Epics Page Content</div>,
	},
	{
		path: "project-tasks",
		element: <div>Tasks Page Content</div>,
	},
	{
		path: "project-members",
		element: <div>Members Page Content</div>,
	},
	{
		path: "project-details",
		element: <div>Details Page Content</div>,
	},
]
);

export function AppRouter() {
	return <RouterProvider router={router} />
}