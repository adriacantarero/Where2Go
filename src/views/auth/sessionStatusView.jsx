import "./authStyles.css";

// Displays the current session status (guest or authenticated)
export function SessionStatusView(props) {
    const { isGuest, email } = props;

    return (
        <div className={`session-status ${isGuest ? "guest" : "auth"}`}>
            {isGuest ? (
                <span>Guest mode</span>
            ) : (
                <span>Signed in as {email || "Google user"}</span>
            )}
        </div>
    );
}