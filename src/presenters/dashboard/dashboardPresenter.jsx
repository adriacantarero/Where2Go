import { LoadingView } from "/src/views/core/loadingView";

// Import the sub-containers
import { Map } from "./map/mapContainer";
import { ResultList } from "./resultList/resultListContainer";
import { ResultDetails } from "./resultDetails/resultDetailsContainer";

// Conditional Rendering Dashboard Presenter
export function DashboardPresenter(props) {
    const { 
        places, 
        selectedPlaceId, 
        itineraryName, 
        startDate, 
        endDate, 
        destinationName 
    } = props;
    
    // Loading state check only if places is null
    if (places === null) {
        return (
            <div style={{ width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LoadingView promise={true} />
            </div>
        );
    }

    // Sidebar: shows details if a place is selected, otherwise shows the list
    const showDetails = selectedPlaceId !== null;

    return (
        <div className="dash-grid">
            {/* TOP BAR: Query Information */}
            <div className="dash-header-info">
                <span className="dash-info-label">Trip:</span>
                <span className="dash-info-value">{itineraryName || "My Trip"}</span>
                <span className="dash-info-sep">|</span>
                <span className="dash-info-label">Destination:</span>
                <span className="dash-info-value">{destinationName || "Unknown"}</span>
                <span className="dash-info-sep">|</span>
                <span className="dash-info-label">Dates:</span>
                <span className="dash-info-value">{startDate} — {endDate}</span>
            </div>

            {/* Horizontal layout for Map and Sidebar */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* LEFT SIDE (Always Map) */}
                <div className="dash-main">
                    <Map />
                </div>

                {/* RIGHT SIDE (Switches between List and Details) */}
                <div className="dash-sidebar">
                    {showDetails ? <ResultDetails /> : <ResultList />}
                </div>
            </div>
        </div>
    );
}