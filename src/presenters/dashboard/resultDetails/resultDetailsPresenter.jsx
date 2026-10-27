import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { ResultDetailsView } from "/src/views/dashboard/resultDetailsView";

export function ResultDetailsPresenter(props) {
    const { tripStart, tripEnd, details, savePoiToStore } = props;

    // Local state for the date input
    const [selectedDate, setSelectedDate] = useState("");

    // Calc dates array based on tripStart and tripEnd (Business Logic)
    const dateOptions = useMemo(() => {
        if (!tripStart || !tripEnd) return [];

        const dates = [];
        let current = dayjs(tripStart);
        const end = dayjs(tripEnd);

        // Generate dates from start to end
        while (current.isBefore(end) || current.isSame(end, 'day')) {
            dates.push(current.format('YYYY-MM-DD'));
            current = current.add(1, 'day');
        }

        return dates;
    }, [tripStart, tripEnd]);

    // Handle the "Add" custom event (Data Transformation)
    function handleAddToItinerary() {
        if (!details) return;

        const mainCategory = details.categories?.[0] || "unknown";
        
        const poiObject = {
            // Identifiers
            id: details.id,
            name: details.name,
            mainCategory: mainCategory,

            // Clean category name
            category: mainCategory.split('.')[1] || mainCategory, 

            // API image or placeholder
            imageUrl: details.image || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg",
            
            // Store full array for accurate icon resolution later
            categories: details.categories,

            // Date to visit
            visitDate: selectedDate || "Unscheduled"
        };
        
        // Save poi
        savePoiToStore(poiObject);
    }

    return (
        <ResultDetailsView 
            {...props}
            // Pass calculated data to View
            dateOptions={dateOptions}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onAddToItinerary={handleAddToItinerary}
        />
    );
}