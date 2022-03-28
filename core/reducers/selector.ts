import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {SelectorState} from "./types";
import {PharmacyData} from "../types";

const initialState: SelectorState = { selected: null };

const selectorSlice = createSlice({
    name: 'selector',
    initialState: initialState,
    reducers: {
        selectPharmacy: (state: SelectorState, action: PayloadAction<PharmacyData|null>) => {
            state.selected = action.payload;
        }
    }
})

export const { selectPharmacy } = selectorSlice.actions;
export default selectorSlice.reducer;