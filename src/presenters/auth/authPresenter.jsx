import { useNavigate } from "react-router-dom";
import { AuthView } from "/src/views/auth/authView";

/*
Orchestrates the user experience on the login screen.
*/
export function AuthPresenter(props) {
    const navigate = useNavigate();

    // Event Handler: standard login flow
    function handleLogin() {
        props.loginWithGoogle();
    }

    // Event Handler: guest flow
    function handleContinueAsGuest() {
        props.setGuestMode();
        navigate("/");
    }

    return (
        <AuthView
            onLogin={handleLogin}
            onContinueAsGuest={handleContinueAsGuest}
        />
    );
}