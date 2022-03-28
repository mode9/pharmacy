import {NaverBounds} from "../mapManager/types";
import Pharmacy from "../pharmacies";
import {PharmacyData} from "../types";

export type pharmacyFilterType = {
    bounds?: NaverBounds|null;
    isHoliday?: boolean;
    showClosed?: boolean;
}

export type State = {
    pharmacies: PharmacyData[];
    filters: pharmacyFilterType;
}

export type SelectorState = {
    selected: PharmacyData | null;
    active: PharmacyData | null;
}

export type CombinedStateType = {
    pharmacies: State,
    selector: SelectorState,
}

