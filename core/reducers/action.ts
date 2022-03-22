import Pharmacy from "../pharmacies";
import {pharmacyFilterType} from "./types";
import {PharmacyData} from "../types";

export const REQUEST_DATA = "PHARMACY_REQUEST_DATA";
export const RECEIVE_DATA = "PHARMACY_RECEIVE_DATA";
export const FILTER_CHANGED = 'PHARMACY_FILTER_CHANGED';
export const SORT_CHANGED = 'PHARMACY_SORT_CHANGED';
export const ITEM_SELECTED = 'PHARMACY_ITEM_SELECTED';

export const filterChanged = (filters: pharmacyFilterType) => {
    console.log('filterChanged', filters);
    return {type: FILTER_CHANGED, payload: filters}
};
export const requestPharmacyData = () => ({ type: REQUEST_DATA });
export const receivePharmacyData = (data: PharmacyData[]) => ({ type: RECEIVE_DATA, payload: data });
export const changeSorting = ((method: string) => ({ type: SORT_CHANGED, payload: method }));
export const selectPharmacy = ((item?: PharmacyData) => ({ type: ITEM_SELECTED, payload: item }));