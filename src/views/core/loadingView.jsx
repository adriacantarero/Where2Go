import "./coreStyle.css";
import { World } from "/src/components/globe/Globe";
import { globeConfig, sampleArcs } from "/src/components/globe/globeConfig"

// Defines loading component based on promise props
export function LoadingView(props) {
    if (props.promise) {
        if (props.error) {
            // Renders error in the standard layout if something breaks
            return (
                <div className="center-frame">
                    <span className="error-text">{props.error.toString()}</span>
                </div>
            );
        }
        
        // Render Full Screen Globe Overlay
        return (
            <div className="loading-screen">
                <div className="globe-wrapper">
                    <World data={sampleArcs} globeConfig={globeConfig} />
                </div>
                
                <div className="loading-text-container">
                    <h2 className="loading-title">Planning your Journey...</h2>
                    <p className="loading-subtitle">Scouting the best locations</p>
                </div>
            </div>
        );
    }
    
    // Render no data (fallback)
    return <span className="center-frame">No data available</span>;
}