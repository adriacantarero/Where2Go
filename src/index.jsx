import { createRoot } from "react-dom/client";
import { ReactRoot } from "./ReactRoot";

// Expose the store in the console during development only
import { store } from "./app/store";
if (import.meta.env.DEV) {
    window.store = store;
}

// Allow code changes without full page reload
if (import.meta.hot) {
    import.meta.hot.accept();
}

const container = document.getElementById('root');
const root = createRoot(container);

// Bootstrap the React application
root.render(<ReactRoot />);
