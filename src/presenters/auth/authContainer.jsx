import { connect } from "react-redux";
import { AuthPresenter } from "/src/presenters/auth/authPresenter";

// Action/Thunk imports
import { loginWithGoogle } from "/src/app/features/auth/authThunks";
import { setSessionMode } from "/src/app/features/auth/authSlice";

function AuthContainer(props) {
    // Pass redux-props to presenter
    return <AuthPresenter {...props} />;
}

// Map Redux-actions to Props
function mapDispatch(dispatch){
    return {
        // Trigger Google login popup
        loginWithGoogle: () => dispatch(loginWithGoogle()),
        // Allow users to explore the app without auth.
        setGuestMode: () => dispatch(setSessionMode("guest"))
    };
}

// Sync presenter with Redux state
export const Auth = connect(null, mapDispatch)(AuthContainer);