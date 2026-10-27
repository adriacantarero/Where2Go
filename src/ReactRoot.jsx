import { Provider } from "react-redux";
import { createHashRouter, RouterProvider } from "react-router-dom";

import { store } from "./app/store";
import { App } from "/src/presenters/appPresenter";
import "./style.css";

// Define router. It points to AppContainer, which handles the sub-routes
const router = createHashRouter([
    {
        path: "/*",
        element: <App />,
    },
]);

export function ReactRoot() {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}
