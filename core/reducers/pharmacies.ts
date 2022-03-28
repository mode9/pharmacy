import {createSlice, PayloadAction, current} from "@reduxjs/toolkit";
import {State, pharmacyFilterType} from "./types";
import {PharmacyData} from "../types";
import {sortWithDistance} from "../mapManager/helpers";

const initialState: State = {pharmacies: [], filters: {bounds: null, showClosed: true, isHoliday: false}};

const pharmaciesSlice = createSlice({
    name: 'pharmacies',
    initialState: initialState,
    reducers: {
        filterChanged: (state: State, action: PayloadAction<pharmacyFilterType>) => {
            const currentFilters = current(state.filters);
            const currentPharmacies = current(state.pharmacies).slice();
            const originBounds = currentFilters.bounds;
            const newBounds = action.payload.bounds;

            if (newBounds) {
                if (originBounds && originBounds.equals(newBounds)) {

                } else {
                    state.pharmacies = sortWithDistance(currentPharmacies, newBounds.getCenter());
                }
            }
            state.filters = {...currentFilters, ...action.payload};
        },
        receivePharmacyData: (state: State, action: PayloadAction<PharmacyData[]>) => { state.pharmacies = action.payload; },
        changeSorting: (state: State, action: PayloadAction<string>) => {
            // const newState = {...state};
            const currentPharmacies = current(state.pharmacies).slice();
            const currentFilters = current(state.filters);
            switch (action.payload) {
                case 'distanceAsc':
                    if (currentFilters.bounds) {
                        state.pharmacies = sortWithDistance(currentPharmacies, currentFilters.bounds.getCenter());
                    }
                    break;
                case 'nameAsc':
                    state.pharmacies = currentPharmacies.sort((a, b) => (
                        a.name > b.name ? 1 : a.name < b.name ? -1 : 0
                    ))
                    break;
            }
        },
    }
})

export const { filterChanged, receivePharmacyData, changeSorting } = pharmaciesSlice.actions;
export default pharmaciesSlice.reducer;