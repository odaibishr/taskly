import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";

import SignUpPage from "../pages/SignUpPage";
import LogInPage from "../pages/LogInPage";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPasswordPage from "../pages/ResetPasswordPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/signup",
		element: <SignUpPage />,
	},
	{
		path: "/login",
		element: <LogInPage />,
	},
	{
		path: "/forget-password",
		element: <ForgetPassword />
	},
	{
		path: "/reset-password",
		element: <ResetPasswordPage />
	}
]);

export function AppRouter() {
	return <RouterProvider router={router} />
}