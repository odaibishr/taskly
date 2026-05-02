import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";

import SignUpPage from "../pages/SignUpPage";
import LogInPage from "../pages/LogInPage";

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
	}
]);

export function AppRouter() {
	return <RouterProvider router={router} />
}