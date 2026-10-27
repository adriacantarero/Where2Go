import { createSlice } from '@reduxjs/toolkit';

/* 
Auth Slice handles the authentication state of the user.
*/
const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        user: undefined, // undefined = loading/unknown, null = logged out, string = logged in
        sessionMode: "auth", // "auth" | "guest"
        error: null 
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            state.error = null;
        },
        setSessionMode(state, action) {
            state.sessionMode = action.payload
        },
        setAuthError(state, action) {
            state.error = action.payload;
        },
    },
});

// Export initial state
export const authInitialState = authSlice.getInitialState();

// Export reducer
export const authReducer = authSlice.reducer;

// Export actions
export const { setUser, setSessionMode, setAuthError } = authSlice.actions;