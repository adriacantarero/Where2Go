import "./itineraryStyle.css";

// View to inform the user that login is required to save itineraries
export function LoginRequiredModalView({ onCancel, onConfirm }) {
    return (
        <div className="modal-backdrop">
            <div className="modal-card">
                <h3>Sign in required</h3>
                <p>To save itineraries, you need to sign in.</p>
                <div className="modal-actions">
                    <button onClick={onCancel}>Cancel</button>
                    <button onClick={onConfirm}>Sign in</button>
                </div>
            </div>
        </div>
    );
}