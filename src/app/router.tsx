import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";

import SignUpPage from "../features/auth/pages/SignUpPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/signup",
		element: <SignUpPage />,
	},
]);

export function AppRouter() {
	return <RouterProvider router={router} />
}