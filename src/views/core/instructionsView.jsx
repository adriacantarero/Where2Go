import "./coreStyle.css";

// Instructions View Component
export function InstructionsView(props) {
    return (
        <div className="instructions-root">
            <div className="instructions-container">
                <div className="instructions-header">
                    <h2 className="instructions-title">How to use Where2Go</h2>
                </div>
                
                <div className="instructions-content">
                    <p className="instructions-intro">
                        Welcome! Follow these simple steps to plan your perfect trip.
                    </p>

                    <div className="instruction-item">
                        <div className="instruction-text">
                            <h3>1. Search for a trip</h3>
                            <p>Enter an <b>Itinerary Name</b>, <b>Destination</b>, and <b>Dates</b> in the home page to start a new adventure.</p>
                        </div>
                    </div>

                    <div className="instruction-item">
                        <div className="instruction-text">
                            <h3>2. Explore</h3>
                            <p>Use the interactive map to discover places. Filter by category (Tourism Sights, Restaurants, etc.) to find what you want to visit.</p>
                        </div>
                    </div>

                    <div className="instruction-item">
                        <div className="instruction-text">
                            <h3>3. Build your itinerary</h3>
                            <p>Select a place and click <b>"+ Add to Itinerary"</b>. You can assign it to a specific day or leave it as unscheduled.</p>
                        </div>
                    </div>

                    <div className="instruction-item">
                        <div className="instruction-text">
                            <h3>4. Organize</h3>
                            <p>In <b>My Itineraries</b> view, drag and drop your places between days to reorganize your trip.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}