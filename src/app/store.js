import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { persistenceMiddleware } from "./middleware/persistenceMiddleware";

import { loadSessionSnapshot, saveSessionSnapshot } from "/src/app/sessionSnapshot";

import { searchInitialState } from "/src/app/features/search/searchSlice";
import { itineraryInitialState } from "/src/app/features/itinerary/itinerarySlice";
import { resultsInitialState } from "/src/app/features/dashboard/resultSlice";
import { resultDetailsInitialState } from "/src/app/features/dashboard/resultDetailsSlice";
import { authInitialState } from "/src/app/features/auth/authSlice";


const snapshot = loadSessionSnapshot();

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(
            persistenceMiddleware
        ),

    preloadedState: snapshot
    ? {
        auth: {
          ...authInitialState,
        sessionMode: snapshot.auth?.sessionMode ?? authInitialState.sessionMode,
        },
        search: { 
          ...searchInitialState,
          params: snapshot.search.params,
        },
        itinerary: {
          ...itineraryInitialState,
          current: snapshot.itinerary.current,
        },
        result: {
          ...resultsInitialState,
          params: {
            ...resultsInitialState.params,
            ...snapshot.result.params,
          },
          results: {
            ...resultsInitialState.results,
            ...snapshot.result.results,
          },
        },
        resultDetails: {
          ...resultDetailsInitialState,
          ...snapshot.resultDetails,
        },
      }
    : undefined,
});

let lastSig = "";
store.subscribe(() => {
  const state = store.getState();

  const sig = JSON.stringify({
    search: state.search.params,
    itineraryId: state.itinerary.current?.id,
    itineraryUpdatedAt: state.itinerary.current?.updatedAt,
    bounds: state.result.params.bounds,
    poiCount: state.result.results.poiList?.length ?? 0,
    placeId: state.resultDetails.placeId,
  });

  if (sig === lastSig) return;
  lastSig = sig;

  saveSessionSnapshot(state);
});
