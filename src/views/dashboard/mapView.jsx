import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { buildMapTileUrl } from "/src/app/models/dashboardModel";
import "./dashboardStyle.css";

// Helper function to create icons
import { getMarkerIcon } from "./dashboardIcons"; 

// Main Map View Component
export function MapView(props) {
    const {
        center,                 
        places,           
        isLoading,        
        placesError,
        activeCategories,
        showSearchBtn,          
        
        // Event Handlers
        onMarkerClick,
        onRedoSearch,
        
        // Logic Components
        MapEffectsComponent
    } = props;

    // Safety check
    if (!center) {
        return <p>Select a destination city first.</p>;
    }

    return (
        <div className="map-wrapper">

            {showSearchBtn && (
                <button 
                    onClick={onRedoSearch}
                    disabled={isLoading}
                    style={{
                        position: "absolute",
                        top: "1rem", left: "50%", transform: "translateX(-50%)",
                        zIndex: 1000, background: "white", padding: "0.5rem 1.2rem",
                        borderRadius: "20px", boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                        border: "none", color: "#228be6", fontWeight: "600", 
                        cursor: isLoading ? "default" : "pointer",
                        display: "flex", alignItems: "center", gap: "8px"
                    }}
                >
                    {isLoading && (
                        <div className="spin" style={{ 
                            width: "12px", height: "12px", margin: 0, 
                            borderWidth: "2px", borderTopColor: "#228be6" 
                        }}></div>
                    )}
                    {isLoading ? "Searching..." : "Search this area"}
                </button>
            )}

            <MapContainer
                center={center}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                {/* 
                The View doesn't know how to handle map events, so it just renders the component provided by the Presenter which handles that
                */}
                {MapEffectsComponent}

                <TileLayer
                    url={buildMapTileUrl()}
                    attribution="© OpenStreetMap contributors, © Geoapify"
                />

                {activeCategories.length > 0 && places && places.map((poi) => (
                    <Marker 
                        key={poi.id} 
                        position={[poi.lat, poi.lon]}
                        icon={getMarkerIcon(poi.mainCategory, poi.categories, poi.isSelected)}
                        eventHandlers={{
                            click: () => onMarkerClick(poi.id),
                        }}
                        ref={poi.markerRef} // Ref passed from Presenter logic if needed
                    >
                        {/* 
                           We force the Popup to be open if selected via props if possible.
                           The Presenter handles the "openPopup()" call via the MapEffectsComponent.
                        */}
                        <Popup>
                            <strong>{poi.name}</strong>
                            <br />  
                            <span style={{ fontSize: "0.9em", color: "#666" }}>
                                {poi.description}
                            </span>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {isLoading && !showSearchBtn && (
                <div className="map-loading">
                    <div className="spin" style={{ width: "16px", height: "16px", marginBottom: 0, borderWidth: "2px" }}></div>
                    <span>Scouting locations...</span>
                </div>
            )}

            {placesError && <div className="map-error">{placesError}</div>}
        </div>
    );
}