import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SelectorState} from "./types";
import {PharmacyData} from "../types";

const initialState: SelectorState = { selected: null, active: null };

const selectorSlice = createSlice({
    name: 'selector',
    initialState: initialState,
    reducers: {
        selectPharmacy: (state: SelectorState, action: PayloadAction<PharmacyData|null>) => {
            state.selected = action.payload;
        },
        activatePharmacy: (state, action) => {
            state.active = action.payload;
        }
    }
})

export const { selectPharmacy, activatePharmacy } = selectorSlice.actions;
export default selectorSlice.reducer;