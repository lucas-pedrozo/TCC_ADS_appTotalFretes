import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/public/Login";

const WebRoutes = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
]);

export default WebRoutes;
