import { SessionStatusView } from "/src/views/auth/sessionStatusView";

export function SessionStatusPresenter(props) {
    return (
        <SessionStatusView 
            isGuest={props.isGuest} 
            email={props.email} 
        />
    );
}