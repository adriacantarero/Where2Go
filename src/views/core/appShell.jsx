import "./coreStyle.css";

// App Shell Layout Component
export function AppShell({ menu, children }) {
    return (
        <div className="app-shell">
            <div className="app-shell__menu">
                {menu}
            </div>

            <div className="app-shell__content">
                {children}
            </div>
        </div>
    );
}