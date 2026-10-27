import { useState, useMemo } from "react"; 
import { useNavigate } from "react-router-dom";

// Import view and constants for logic
import { ResultListView } from "/src/views/dashboard/resultListView";
import { getCategoryDetails, CATEGORY_DEFINITIONS } from "/src/views/dashboard/dashboardIcons";

export function ResultListPresenter(props) {
    const { places, activeCategories, onCategoryChange } = props;
    
    // UI State for dropdown visibility
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleToggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    // Logic: Update category array (Immutable update)
    const handleToggleCategory = (categoryId) => {
        const isActive = activeCategories.includes(categoryId);
        let newCategories;
        if (isActive) {
            newCategories = activeCategories.filter(c => c !== categoryId);
        } else {
            newCategories = [...activeCategories, categoryId];
        }
        onCategoryChange(newCategories);
    };

    // Logic: Select All
    const handleSelectAll = () => {
        const allIds = CATEGORY_DEFINITIONS.map(d => d.id);
        onCategoryChange(allIds);
    };

    // Logic: Clear All
    const handleClear = () => {
        onCategoryChange([]);
    };

    // Sort places
    const sortedPlaces = useMemo(() => {
        if (!places) return [];
        return [...places].sort((a, b) => {
            // Primary Sort: Category
            const catCompare = a.mainCategory.localeCompare(b.mainCategory);
            if (catCompare !== 0) return catCompare;
            
            // Secondary Sort: Name
            return a.name.localeCompare(b.name);
        });
    }, [places]);

    const navigate = useNavigate();

    return (
        <ResultListView 
            {...props} 
            sortedPlaces={sortedPlaces}
            isDropdownOpen={isDropdownOpen}
            
            // Event Handlers
            onBackToSearch={() => navigate('/')}
            onToggleDropdown={handleToggleDropdown}
            onToggleCategory={handleToggleCategory}
            onSelectAllCategories={handleSelectAll}
            onClearCategories={handleClear}
        />
    );
}