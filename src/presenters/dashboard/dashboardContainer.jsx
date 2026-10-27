import { connect } from "react-redux";
import { DashboardPresenter } from "./dashboardPresenter";

// Import Selectors
import { selectResults } from "/src/app/features/dashboard/resultSlice";
import { selectCurrentPlaceId } from "/src/app/features/dashboard/resultDetailsSlice";

function DashboardContainer(props) {
    return <DashboardPresenter {...props} />;
}

// Map Redux state to props
function mapState(state) {
    const searchParams = state.search.params;
    console.log(searchParams)
    
    return {
        places: selectResults(state),
        selectedPlaceId: selectCurrentPlaceId(state),

        // Itinerary Info Props from Search Slice
        itineraryName: searchParams.title, 
        startDate: searchParams.departureDate,
        endDate: searchParams.returnDate,
        destinationName: searchParams.destinationCity?.value
    };
}

// Sync presenter with Redux state
export const Dashboard = connect(mapState)(DashboardContainer);