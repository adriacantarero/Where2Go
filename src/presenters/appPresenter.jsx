import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";

// Logic imports
import { initAuthListener } from "/src/app/features/auth/authListeners";

// Child presenters
import { Auth } from "/src/presenters/auth/authContainer";
import { Search } from "/src/presenters/search/searchContainer";
import { Dashboard } from "/src/presenters/dashboard/dashboardContainer";
import { Itinerary } from "/src/presenters/itinerary/itineraryContainer";
import { SessionStatus } from "/src/presenters/auth/sessionStatusContainer";
import { Menu } from "/src/presenters/core/menuContainer";

// Views
import { SuspenseView } from "/src/views/core/suspenseView";
import { InstructionsView } from "/src/views/core/instructionsView";
import { AppShell } from "/src/views/core/appShell";

export function App() {

    // Get dispatch function
    const dispatch = useDispatch();

    // Grab state of interest
    const user = useSelector((state) => state.auth.user);
    const isReady = useSelector((state) => state.core.isReady);
    const sessionMode =  useSelector(state => state.auth.sessionMode);

    const showSessionStatus =
    user !== undefined &&
    !(user === null && sessionMode !== "guest");

    // Initialize auth listener on App mount, cleanup on unmount
    useEffect(() => {
        const unsubscribe = initAuthListener(dispatch);
        return () => unsubscribe();
    }, [dispatch]); // Run only once, dispatch is stable

    // --- Render logic ---
    function renderContent() {
        // Case 1: we don't know if there is a user
        if (user === undefined) {
            return <SuspenseView promise="Checking authentication..." />;
        }

        // Case 2: there is no authenticated user and the user has not selected "Guest".
        if (user === null && sessionMode !== "guest") {
            return (
                <div className="center-frame">
                    <Routes>
                        <Route path="/auth" element={<Auth />} />
                        {/* Redirect any other path to auth*/}
                        <Route path="*" element={<Navigate to="/auth" replace />} />
                    </Routes>
                </div>
            );
        }

        // Case 3: there is a user, but the model is not ready yet
        if (!isReady) {
            return <SuspenseView promise="Loading model..." />;
        }

        // Case 4: there is a user and the model is ready.
        return (
            <>
                {/* Main Content Area */}
                <AppShell menu={<Menu/> }>
                    {showSessionStatus && <SessionStatus />}
                    <div className="center-frame">
                        <Routes>
                            {/* Default: Search Page */}
                            <Route path="/" element={<Search />} />

                            {/* Interactive Map Dashboard */}
                            <Route path="/map" element={<Dashboard />} />

                            {/* Trip Planner */}
                            <Route path="/itinerary" element={<Itinerary />} />

                            {/* Instructions Page */}
                            <Route path="/instructions" element={<InstructionsView />} />

                            {/* Redirects */}
                            <Route path="/auth" element={<Navigate to="/" replace />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </AppShell>
            </>
        );
    }

    return (
        <div className="app-layout">
            {renderContent()}
        </div>
    );
}