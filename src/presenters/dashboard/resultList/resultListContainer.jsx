import { connect } from "react-redux";
import { ResultListPresenter } from "./resultListPresenter";

// Import Action Creators
import { changeCategoryAction, selectPlaceAction } from "/src/app/features/dashboard/dashboardThunks";

// Import Selectors
import { 
    selectResults, 
    selectResultsLoading,
    selectResultsError, 
    selectCategories, 
} from "/src/app/features/dashboard/resultSlice";

function ResultListContainer(props) {
    return <ResultListPresenter {...props} />;
}

// Map Redux state to props
function mapState(state) {
    const places = selectResults(state);

    return {
        places: places || [],
        isLoading: selectResultsLoading(state),
        listError: selectResultsError(state),
        activeCategories: selectCategories(state) || [],
    };
}

// Map Redux actions to props
function mapDispatch(dispatch) {
    return {
        onCategoryChange: (newCategories) => dispatch(changeCategoryAction(newCategories)),
        onPlaceClick: (placeId) => dispatch(selectPlaceAction(placeId))
    };
}

// Sync presenter with Redux state
export const ResultList = connect(mapState, mapDispatch)(ResultListContainer);