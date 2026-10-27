import { createSlice } from '@reduxjs/toolkit';

/*
Core slice manages global application lifecycle.
*/
const coreSlice = createSlice({
    name: 'core',
    initialState: {
        // Tracks if the app has finished its initial data-sync
        isReady: false,
        // UI state flag used to block global navigation while a modal dialog is active.
        modalOpen: false, 
    },
    reducers: {
        setReady(state, action) {
            state.isReady = action.payload;
        },
        setModalOpen(state, action) {
            state.modalOpen = action.payload;
        },
    },
});

// Export reducer
export const coreReducer = coreSlice.reducer;

// Export actions for use in presenters and listeners
export const { setReady, setModalOpen } = coreSlice.actions;