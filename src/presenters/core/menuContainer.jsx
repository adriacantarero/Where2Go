import { connect } from "react-redux";
import { MenuPresenter } from "/src/presenters/core/menuPresenter";

// Firebase imports
import { auth } from "/src/firebaseConfig";
import { signOut } from "firebase/auth";

// Authentitcation imports
import { setAuthError, setSessionMode } from "/src/app/features/auth/authSlice";
import { loginWithGoogle } from "/src/app/features/auth/authThunks";

// State resets / actions imports
import { resetSearch, setDestinationCity, setDepartureDate, setReturnDate } from "/src/app/features/search/searchSlice";
import { clearItinerary } from "/src/app/features/itinerary/itinerarySlice";
import { clearSelectionAction, searchPlacesAction } from "/src/app/features/dashboard/dashboardThunks";
import { clearResults, selectResults } from "/src/app/features/dashboard/resultSlice";
import { setTitle, restoreHomeSearch } from "/src/app/features/search/searchSlice";

function MenuContainer(props) {
    // Pass redux-props to presenter
    return <MenuPresenter {...props} />;
}

// Map Redux state to props
function mapState(state){
    return {
        user: state.auth.user,
        modalOpen: state.core.modalOpen,
        currentItinerary: state.itinerary.current,
        hasActiveSearch: !!state.search.params.destinationCity?.lat,
        hasMapResults: !!selectResults(state) 
    };
}

// Map Redux-actions to Props
function mapDispatch(dispatch){
    return {
        // Clear detail view before navigating
        onClearSelection: () => {
            dispatch(clearSelectionAction());
        },

        // Complete state reset on logout
        onLogout: () => {
            signOut(auth)
                .then(() => {
                    dispatch(resetSearch());
                    dispatch(clearItinerary());
                    dispatch(setSessionMode("auth")); 
                    dispatch(clearSelectionAction());
                })
                .catch(err => {
                    dispatch(setAuthError(err.message));
                });
        },

        onLogin: () => dispatch(loginWithGoogle()),

        // Synchronize the map and form state with a selected saved itinerary.
        onLoadPlacesForCurrentItinerary: (currentItinerary, hasMapResults) => {
            // If results already exist, skip the API call and just navigate
            if (hasMapResults) return;

            const dest = currentItinerary?.tripDestination;
            if (!dest?.lat) return;

            // Sync form state
            dispatch(setDestinationCity(dest));
            dispatch(setTitle(currentItinerary?.title || ""));
            dispatch(setDepartureDate(currentItinerary?.startDate || null));
            dispatch(setReturnDate(currentItinerary?.endDate || null));

            if (!dest?.lat || !dest?.lon) return;

            // Trigger map search 
            const offset = 0.05;
            const bounds = `${dest.lon - offset},${dest.lat - offset},${dest.lon + offset},${dest.lat + offset}`;

            dispatch(clearResults());
            dispatch(clearSelectionAction());
            dispatch(searchPlacesAction(bounds));
        },

        restoreHomeSearch: () => dispatch(restoreHomeSearch()),
    };
}

// Sync presenter with Redux state
export const Menu = connect(mapState, mapDispatch)(MenuContainer);
