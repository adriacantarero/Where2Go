import "./coreStyle.css";
import { Loader } from "/src/components/loader"; 

// Defines suspense component based on promise props
export function SuspenseView(props) {
    if (props.promise) {
        if (props.error) {
            // Renders error if promise and error are truthy
            return <span className="centered-container">{props.error.toString()}</span>;
        }
        // Render suspense image if pending promise
        return (
            <div className="centered-container">
                <Loader />
            </div>
        );
    }
    // Render no data if there's no promise
    return <span className="centered-container">no data</span>;
}