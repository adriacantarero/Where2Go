import { combineReducers } from "redux";

// Import slice reducers
import { coreReducer } from "./features/core/coreSlice";
import { authReducer } from "./features/auth/authSlice";
import { searchReducer } from "./features/search/searchSlice";
import { resultReducer } from "./features/dashboard/resultSlice";
import { resultDetailsReducer } from "./features/dashboard/resultDetailsSlice";
import { itineraryReducer } from "./features/itinerary/itinerarySlice";


// Combine feature reducers (application state only; no side effects here)
export const rootReducer = combineReducers({
    core: coreReducer,
    auth: authReducer,
    search: searchReducer,
    result: resultReducer,
    resultDetails: resultDetailsReducer,
    itinerary: itineraryReducer,
});