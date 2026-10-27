import React from "react";
import { CATEGORY_DEFINITIONS, getCategoryDetails } from "./dashboardIcons"; 
import "./dashboardStyle.css";

// Helper Component: Renders an icon for a given category
function PlaceIcon({ category, categoriesArray = [], small = false, forceColor = null }) {
    const details = getCategoryDetails(category, categoriesArray);
    const bgColor = forceColor || details.color;
    const svgContent = details.svg;
    const wrapperClass = small ? "filter-icon-container" : "list-icon-wrapper";

    return (
        <div className={wrapperClass} style={{ backgroundColor: bgColor }}>
            <svg 
                className={small ? "" : "list-icon-svg"} 
                viewBox="0 0 24 24" 
                dangerouslySetInnerHTML={{ __html: svgContent }} 
            />
        </div>
    );
}

// Main Component: Result List View
export function ResultListView(props) {
    const { 
        // Data Props
        sortedPlaces, 
        isLoading, 
        listError, 
        activeCategories = [],
        isDropdownOpen,
        
        // Action Props
        onToggleDropdown,
        onToggleCategory,
        onSelectAllCategories,
        onClearCategories,
        onPlaceClick,
    } = props;

    return (
        <div className="side-panel">
            {/* HEADER: Dropdown Filter */}
            <div className="list-header">

                <h3 className="list-title">Search Results</h3>
                
                <div className="filter-wrapper">
                    {/* Trigger Button */}
                    <button 
                        className="filter-btn" 
                        onClick={onToggleDropdown}
                    >
                        <span>Select Categories</span>
                        <span>{isDropdownOpen ? "▴" : "▾"}</span>
                    </button>

                    {/* Dropdown Menu*/}
                    {isDropdownOpen && (
                        <div className="filter-menu">
                            
                            {/* Action Buttons Row */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <button 
                                    className="filter-clear-btn"
                                    style={{ flex: 1, marginBottom: 0, background: '#f8fafc', color: '#64748b' }}
                                    onClick={onSelectAllCategories}
                                >
                                    Select All
                                </button>
                                <button 
                                    className="filter-clear-btn"
                                    style={{ flex: 1, marginBottom: 0 }}
                                    onClick={onClearCategories}
                                >
                                    Clear
                                </button>
                            </div>

                            {/* Render Icons as Inputs */}
                            {CATEGORY_DEFINITIONS.map(def => {
                                const isChecked = activeCategories.includes(def.id);
                                
                                return (
                                    <div 
                                        key={def.id} 
                                        className={`filter-row ${isChecked ? 'active' : ''}`}
                                        onClick={() => onToggleCategory(def.id)}
                                    >
                                        <PlaceIcon 
                                            category={def.id} 
                                            small={true} 
                                            forceColor={isChecked ? null : "#cbd5e1"} 
                                        />
                                        
                                        <span className="filter-label" style={{ marginLeft: '0.75rem' }}>
                                            {def.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                {/* num of categories selected */}
                <div className="list-meta">
                    {activeCategories.length} categories selected • {sortedPlaces ? sortedPlaces.length : 0} results
                </div>
            </div>

            {/* BODY: Scrollable List */}
            <div className="list-scroll">
                {isLoading ? (
                    // When loading, show only the spinner, clear previous results
                    <div className="state-box">
                        <div className="spin"></div>
                        <p>Updating results...</p>
                    </div>
                ) : listError ? (
                    <div className="state-box error-msg">{listError}</div>
                ) : activeCategories.length === 0 ? (
                    <div className="state-box">
                        <p>Showing popular places.</p>
                        <small>Use the dropdown to filter.</small>
                    </div>
                ) : (
                    <>
                        {sortedPlaces?.length === 0 ? (
                            <div className="state-box">
                                <p>No places found in this area.</p>
                                <small>Try moving the map.</small>
                            </div>
                        ) : (
                            // Only render places when not loading and we have places
                            sortedPlaces && sortedPlaces.map((place) => (
                                <div key={place.id} className="place-card"
                                    onClick={() => onPlaceClick(place.id)}
                                >
                                    <PlaceIcon category={place.mainCategory} categoriesArray={place.categories} />
                                    
                                    <div className="place-info">
                                        <div className="place-name">{place.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                                            {getCategoryDetails(place.mainCategory, place.categories).label}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
}