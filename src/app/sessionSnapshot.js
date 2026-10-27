const SESSION_KEY = "where2go:session:v1";

export function saveSessionSnapshot(state) {
  const snapshot = {
    v: 1,
    auth: { sessionMode: state.auth.sessionMode },
    search: {
      params: state.search.params,
    },
    itinerary: {
      current: state.itinerary.current,
    },
    result: {
      params: {
        bounds: state.result.params.bounds,
      },
      results: {
        itineraryIdLoaded: state.result.results.itineraryIdLoaded,
        poiList: state.result.results.poiList,
      },
    },
    resultDetails: {
      placeId: state.resultDetails.placeId,
    },
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(snapshot));
}

export function loadSessionSnapshot() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const snapshot = JSON.parse(raw);
    if (snapshot.v !== 1) return null;

    return snapshot;
  } catch {
    return null;
  }
}

export function clearSessionSnapshot() {
  sessionStorage.removeItem(SESSION_KEY);
}
