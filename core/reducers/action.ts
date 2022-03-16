import Pharmacy from "../pharmacies";
import {pharmacyFilterType} from "./types";
import {PharmacyData} from "../types";

export const REQUEST_DATA = "PHARMACY_REQUEST_DATA";
export const RECEIVE_DATA = "PHARMACY_RECEIVE_DATA";
export const FILTER_CHANGED = 'PHARMACY_FILTER_CHANGED';

export const filterChanged = (filters: pharmacyFilterType) => {
    console.log('filterChanged', filters);
    return {type: FILTER_CHANGED, payload: filters}
};
export const requestPharmacyData = () => ({ type: REQUEST_DATA });
export const receivePharmacyData = (data: PharmacyData[]) => ({ type: RECEIVE_DATA, payload: data });

