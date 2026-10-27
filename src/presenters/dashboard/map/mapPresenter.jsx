import { useState, useEffect, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { MapView } from "/src/views/dashboard/mapView";

// UI Logic functions 

// Map interaction
function MapInteraction({ destinationCity, onAreaChange, onBackgroundClick }) {
    const map = useMap();

    // Side Effect: Recenter when city changes
    useEffect(() => {
        if (destinationCity?.lat && destinationCity?.lon) {
            map.setView([destinationCity.lat, destinationCity.lon], 13);
        }
    }, [destinationCity, map]);

    // Map Events
    useMapEvents({
        moveend: () => onAreaChange(),
        click: () => onBackgroundClick && onBackgroundClick()
    });

    return null;
}

// Highlight POI in map
function MapHighlight({ selectedPlaceId, places }) {
    const map = useMap();
    
    // Side Effect: Fly to pin
    useEffect(() => {
        if (!selectedPlaceId || !places) return;
        const target = places.find(p => p.id === selectedPlaceId);
        if (target) {
            map.flyTo([target.lat, target.lon], 15, { animate: true, duration: 1.5 });
        }
    }, [selectedPlaceId, places, map]);

    return null;
}

// Popup management
function PopupManager({ selectedPlaceId, markerRefs }) {
    useEffect(() => {
        if (selectedPlaceId && markerRefs.current && markerRefs.current[selectedPlaceId]) {
            markerRefs.current[selectedPlaceId].openPopup();
        }
    }, [selectedPlaceId]);
    return null;
}

// Helper wrapper to use useMap inside the container context
function MapLogicWrapper({ destinationCity, onAreaChange, onBackgroundClick, setMapRef }) {
    const map = useMap();
    useEffect(() => { setMapRef(map); }, [map, setMapRef]);
    
    return (
        <MapInteraction 
            destinationCity={destinationCity} 
            onAreaChange={onAreaChange} 
            onBackgroundClick={onBackgroundClick} 
        />
    );
}

// Map presenter
export function MapPresenter(props) {
    const { 
        destinationCity, places, onMapMove, selectedPlaceId, onBackgroundClick 
    } = props;

    // Local UI State (Presenter State)
    const [showSearchBtn, setShowSearchBtn] = useState(false);
    
    // Refs for imperative Leaflet access
    const markerRefs = useRef({}); 
    const mapInstanceRef = useRef(null);

    // Reset button when data loads
    useEffect(() => {
        if (!props.isLoading) setShowSearchBtn(false);
    }, [places, props.isLoading]);

    // Handle "Search Here" custom event
    function handleRedoSearch() {
        if (!mapInstanceRef.current) return;
        const bounds = mapInstanceRef.current.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        onMapMove(`${sw.lng},${sw.lat},${ne.lng},${ne.lat}`);
    }

    // Logic Component to inject into View (Pure Injection Pattern)
    const MapEffectsComponent = (
        <>
            <MapLogicWrapper 
                destinationCity={destinationCity}
                onAreaChange={() => setShowSearchBtn(true)}
                onBackgroundClick={onBackgroundClick}
                setMapRef={(map) => { mapInstanceRef.current = map; }}
            />
            <MapHighlight selectedPlaceId={selectedPlaceId} places={places} />
            <PopupManager selectedPlaceId={selectedPlaceId} markerRefs={markerRefs} />
        </>
    );

    // Prepare data for View
    const center = (destinationCity?.lat && destinationCity?.lon) 
        ? [destinationCity.lat, destinationCity.lon] 
        : null;

    const placesWithRefs = places ? places.map(p => ({
        ...p,
        isSelected: p.id === selectedPlaceId,
        markerRef: (el) => { if(el) markerRefs.current[p.id] = el; }
    })) : [];

    return (
        <MapView 
            {...props}
            center={center}
            places={placesWithRefs}
            showSearchBtn={showSearchBtn}
            onRedoSearch={handleRedoSearch}
            MapEffectsComponent={MapEffectsComponent}
        />
    );
}