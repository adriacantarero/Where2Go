import { connect } from "react-redux";
import { SessionStatusPresenter } from "./sessionStatusPresenter";

function SessionStatusContainer(props) {
    // Pass redux-props to presenter
    return <SessionStatusPresenter {...props} />;
}

// Map Redux state to props
function mapState(state) {
    return {
        isGuest: !state.auth.user,
        email: state.auth.user?.email,
    };
}

// Sync presenter with Redux state
export const SessionStatus = connect(mapState)(SessionStatusContainer);