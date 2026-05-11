import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import App from "../App";

import SignUpPage from "../pages/SignUpPage";
import LogInPage from "../pages/LogInPage";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import DashboardLayout from "../layouts/DashboardLayout";
import Navbar from "../shared/components/Navbar";

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
		path: "/dashboard",
		element: (
			<DashboardLayout>
				<Outlet />
			</DashboardLayout>
		),
		children: [
			{
				path: "projects", // سيصبح المسار /dashboard/projects
				element: <div>Projects Page Content</div>, // استبدلها بمكون الصفحة الحقيقي لاحقاً
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
	}
]);

export function AppRouter() {
	return <RouterProvider router={router} />
}