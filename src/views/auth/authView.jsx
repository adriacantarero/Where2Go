import "./authStyles.css";

// Defines authentication view component
export function AuthView(props) {

    return (
        <div className="glass-panel auth-card">
            <div>
                <span className="auth-tag">A TRAVEL GUIDE</span>

                <h1 className="auth-title">
                    Be Prepared For Your
                    <br />
                    Next Trip
                </h1>
            </div>

            <button
                className="btn-primary auth-btn-spacer"
                onClick={props.onLogin}
            >
                Sign in to start
            </button>

            <p className="auth-hint">
                <button type="button" className="auth-guest-link" onClick={props.onContinueAsGuest}>
                    Start as a Guest
                </button>
            </p>
        </div>
    );
}