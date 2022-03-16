import {Holiday} from "../../types";

export const HOLIDAY_RECEIVE_DATA = "HOLIDAY_RECEIVE_DATA";
export const receiveHolidayData = (data: Holiday[]) => ({ type: HOLIDAY_RECEIVE_DATA, data });
