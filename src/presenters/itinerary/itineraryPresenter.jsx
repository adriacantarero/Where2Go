import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { ItineraryView } from "/src/views/itinerary/itineraryView";

export function ItineraryPresenter(props) {
    const { 
        currentItinerary, onRenameItinerary, onClearSearchForm, 
        onLoadPlacesForCurrentItinerary, onMovePoi, onRemovePoi, 
        user, onRequestSavingItinerary, onSetModalOpen, snapshotHomeSearch 
    } = props;
    
    const navigate = useNavigate();

    const [loginRequired, setLoginRequired] = useState(false);

    const isGuest = !user;

    // Saving handler 
    const handleSaveItinerary = () => {
        if(isGuest){
            setLoginRequired(true);
            onSetModalOpen(true);
            return;
        }
        onRequestSavingItinerary();
    };

    const handleCancelLoginRequired = () => {
        setLoginRequired(false);
        onSetModalOpen(false);
    }

    const handelConfirmLoginRequired = () => {
        setLoginRequired(false);
        onSetModalOpen(false);   
        props.loginWithGoogle();
    }

    const handleBackToMap = () => {
        navigate("/map");
    };

    const handleSearchNew = () => {
        // Clear logic
        onClearSearchForm();
        snapshotHomeSearch(); 
        // Navigation logic
        navigate("/");
    };

    const handleAddNewPlaces = () => {
        onLoadPlacesForCurrentItinerary(currentItinerary, props.hasMapResults);
        navigate("/map");
    };

    // Drag and Drop Handlers

    const handleDragStart = (e, placeId) => {
        e.dataTransfer.setData("placeId", placeId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, targetDate) => {
        e.preventDefault();
        const placeId = e.dataTransfer.getData("placeId");
        if (placeId && onMovePoi) {
            onMovePoi(placeId, targetDate);
        }
    };

    const handleRemoveClick = (e, id) => {
        e.stopPropagation();
        onRemovePoi(id);
    };

    // Title state
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [draftTitle, setDraftTitle] = useState("");

    const handleStartEditing = () => {
        setDraftTitle(currentItinerary?.title || "Itinerary");
        setIsEditingTitle(true);
    };

    const handleSaveTitle = () => {
        const newTitle = draftTitle.trim() || "Itinerary";
        onRenameItinerary(newTitle);
        setIsEditingTitle(false);
    };

    // Data processing (grouping and summary)
    const itineraryItems = currentItinerary?.pois || [];
    const totalItems = itineraryItems.length;

    // Group items by visitDate
    const groupedItems = useMemo(() => {
        const groups = {};
        
        // Init all dates in range
        if (currentItinerary?.startDate && currentItinerary?.endDate) {
            let current = dayjs(currentItinerary.startDate);
            const end = dayjs(currentItinerary.endDate);
            
            while (current.isBefore(end) || current.isSame(end, 'day')) {
                groups[current.format('YYYY-MM-DD')] = [];
                current = current.add(1, 'day');
            }
        }
        
        // Sort items into groups
        itineraryItems.forEach(item => {
            const dateKey = item.visitDate || "Unscheduled";
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(item);
        });

        // Sort keys: dates chronologically, "Unscheduled" last
        const sortedKeys = Object.keys(groups).sort((a, b) => {
            if (a === "Unscheduled") return 1; 
            if (b === "Unscheduled") return -1;
            return a.localeCompare(b);
        });

        return { groups, sortedKeys };
    }, [itineraryItems, currentItinerary?.startDate, 
        currentItinerary?.endDate]);

    return (
        <ItineraryView 
            {...props} 
            
            // Calculated data
            groupedItems={groupedItems}
            totalItems={totalItems}

            // Title state
            isEditingTitle={isEditingTitle}
            draftTitle={draftTitle}
            setDraftTitle={setDraftTitle}
            onStartEditing={handleStartEditing}
            onSaveTitle={handleSaveTitle}

            // Navigation
            onBackToMap={handleBackToMap}
            onSearchNewTrip={handleSearchNew}
            onAddNewPlaces={handleAddNewPlaces}

            //Show Modal
            isGuest={isGuest}
            onSaveItinerary={handleSaveItinerary} //Checks if there should appear a modal when trying to save if there is a guest user, or save the itinerary if there is logged user
            loginRequired={loginRequired} //Boolean to check if authentication is needed to perform the action.
            onCancelLoginRequired={handleCancelLoginRequired}
            onConfirmLoginRequired={handelConfirmLoginRequired}

            // Drag and Drop
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}

            // Remove POI
            onRemoveClick={handleRemoveClick}
        />
    );
}