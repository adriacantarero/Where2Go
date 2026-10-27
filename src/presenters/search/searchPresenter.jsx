import { useNavigate } from "react-router-dom";
import { SearchView } from "/src/views/search/searchView";

export function SearchPresenter(props) {
    const navigate = useNavigate();

    // Custom handler that combines Redux action + Navigation
    const handlePlanTrip = (cityObj) => {
        // Dispatch the data logic (via props from connect)
        props.onPlanTrip(cityObj);
        // Navigate to the map view
        navigate("/map");
    };

    // Main entry point for generating a itinerary
    const handleGenerateItinerary = () => { 
        const titleToSave =  props.itineraryTitle?.trim() || "Itinerary";
        props.snapshotHomeSearch();

        // Logic to initialize the itinerary state
        props.onCreateItinerary({
            title: titleToSave,
            tripDestination: props.to,
            startDate: props.depart,
            endDate: props.ret,
        });

        // Trigger navigation and map search
        handlePlanTrip(props.to);
    };

    return (
        <SearchView 
            {...props} 
            onGenerateItinerary={handleGenerateItinerary}
        />
    );
}

