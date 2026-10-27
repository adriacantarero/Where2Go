import "./itineraryStyle.css";
// Import the connected details presenter
import { LoginRequiredModalView } from "/src/views/itinerary/loginRequiredModalView";
import { ResultDetails } from "/src/presenters/dashboard/resultDetails/resultDetailsContainer";

// Itinerary View
export function ItineraryView(props){
    
    const { 
        currentItinerary, itineraries, 
        groupedItems, totalItems,
        isEditingTitle, draftTitle, setDraftTitle,
        onStartEditing, onSaveTitle, 
        onSearchNewTrip, onAddNewPlaces, 
        onSelectItinerary, onRequestDeleteItinerary,
        onSelectPlace, isDetailsOpen, 
        onDragStart, onDragOver, onDrop,
        onRemoveClick
    } = props;

    // Current trip has valid destination (activate or not back to map available)
    const hasDestination = !!currentItinerary?.tripDestination?.lat;

    return (
        <div className="itinerary-root"> 
            <div className="itinerary-columns">
                
                { /* Sidebar (My Itineraries), static on left */ }
                <aside className="itinerary-sidebar">
                    <h3 className="sidebar-title"> My Itineraries </h3>
                    { itineraries.length === 0 && (
                        <p className="sidebar-empty"> No itineraries yet </p>
                    )}
                    <ul className="sidebar-list">
                        {itineraries.map((itin) => (
                            <li
                                key={itin.id}
                                className={"sidebar-item" + (itin.id === currentItinerary?.id ? " sidebar-item--active" : "")}
                                onClick={() => onSelectItinerary(itin.id)}
                            >
                                {itin.title || itin.destination || "Untitled itinerary"}
                            </li>
                        ))}
                    </ul>
                    <button className="sidebar-add-trip" type="button" onClick={onSearchNewTrip}> Search new trips </button>
                </aside>
                {/* Right column: Main Content*/}
                <div className="itinerary-right">
                    
                    {/* Main content area (flex) */}
                    <main className="itinerary-main">
                        
                        {/* List column: Expands if no details, shrinks if details open */}
                        <section className="itinerary-list-panel">
                            {/* Header Row: Title (Left) + Back to Map Button (Right) */}
                            <div className="itinerary-header-row">
                                <h2 className="itinerary-title" onDoubleClick={onStartEditing} style={{ position: "relative", cursor: "pointer" }}>
                                    { isEditingTitle ? ( 
                                        <input 
                                            autoFocus 
                                            value={draftTitle} 
                                            onChange={(e) => setDraftTitle(e.target.value)} 
                                            onBlur={onSaveTitle}
                                            onKeyDown={(e) => { if(e.key === "Enter") onSaveTitle()}}
                                            className="itinerary-title-input"
                                        />
                                    ) : (
                                        <> 
                                            { currentItinerary?.title ||  "Itinerary" }
                                            <img
                                                src="https://imgur.com/mmXWvBJ.jpeg"
                                                className="edit-icon"
                                                onClick={onStartEditing}
                                                draggable="false"
                                                alt="edit"
                                            />
                                        </>
                                    )} 
                                </h2>

                                {/* Button Go to Map */}
                                {hasDestination && (
                                    <button
                                        className="header-map-btn"
                                        onClick={onAddNewPlaces}
                                        title="Go to map to add more places"
                                    >
                                        <img
                                            src="https://img.icons8.com/ios-filled/50/2563EB/map.png"
                                            alt="map icon"
                                            className="map-btn-icon"
                                        />
                                        Go to Map
                                    </button>
                                )}
                            </div>

                            {/* Info (Destination & Dates) */}
                            <div className="itinerary-info-row">
                                <span className="itinerary-info-item">
                                    {currentItinerary?.tripDestination?.value || "Unknown Destination"}
                                </span>
                                
                                {currentItinerary?.startDate && currentItinerary?.endDate ? (
                                    <>
                                        <span className="itinerary-info-separator">•</span>
                                        <span className="itinerary-info-item">
                                            {currentItinerary.startDate} — {currentItinerary.endDate}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="itinerary-info-separator">•</span>
                                        <span className="itinerary-info-item" style={{ fontStyle: "italic", opacity: 0.7 }}>
                                            No dates selected
                                        </span>
                                    </>
                                )}
                            </div>


                            <p className="itinerary-count"> {totalItems} items </p>

                            {/* Grouped List */}
                            <div className="itinerary-grouped-list">
                                {groupedItems.sortedKeys.map(dateKey => {
                                    const dayList = groupedItems.groups[dateKey];
                                    
                                    return (
                                        <div 
                                            key={dateKey} 
                                            className="itinerary-day-group"
                                            onDragOver={onDragOver}
                                            onDrop={(e) => onDrop(e, dateKey)}
                                        >
                                            <h3 className="itinerary-day-header">
                                                {dateKey === "Unscheduled" ? "Unscheduled Places" : `Day: ${dateKey}`}
                                            </h3>
                                            
                                            {/* Empty day message */}
                                            {(!dayList || dayList.length === 0) ? (
                                                <p className="itinerary-empty-day"> No plans </p>
                                            ) : (
                                                <ul className="itinerary-list">
                                                    {dayList.map((item) => (
                                                        <li 
                                                            key={item.id} 
                                                            className="itinerary-item"
                                                            onClick={() => onSelectPlace(item.id)}
                                                            draggable="true"
                                                            onDragStart={(e) => onDragStart(e, item.id)}
                                                        >
                                                            <div className="itinerary-item-info">
                                                                <span className="itinerary-item-name"> {item.name} </span>
                                                                <span className="itinerary-item-category"> {item.category || item.mainCategory || "Other"} </span>
                                                            </div>
                                                            
                                                            <button 
                                                                className="itinerary-item-remove" 
                                                                type="button" 
                                                                onClick={(e) => onRemoveClick(e, item.id)} 
                                                            > x </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    );
                                })}

                                {groupedItems.sortedKeys.length === 0 && (
                                    <p style={{fontStyle:"italic", color:"#999", padding:"20px"}}>No places added yet.</p>
                                )}
                            </div>

                            <div className="itinerary-actions">
                                <button className="itinerary-save-button" onClick={ props.onSaveItinerary }> Save Itinerary </button> 
                                { props.loginRequired && ( <LoginRequiredModalView onCancel={props.onCancelLoginRequired} onConfirm={props.onConfirmLoginRequired} />)}
                                <button className="itinerary-delete-button" disabled={props.isGuest} onClick={() => !props.isGuest && onRequestDeleteItinerary()}> Delete Itinerary </button>
                            </div>
                        </section>

                        {/* Details column */}
                        {isDetailsOpen && (
                            <aside className="itinerary-details-panel">
                            <ResultDetails hideAddButton={true} /> 
                            </aside>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
}