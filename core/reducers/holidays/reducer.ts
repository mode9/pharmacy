import {Holiday} from "../../types";
import {HOLIDAY_RECEIVE_DATA, receiveHolidayData} from "./action";

type dataActionType = ReturnType<typeof receiveHolidayData>;

export const initialState: Holiday[] = [];

const dataReducer = (state=initialState, action: dataActionType) => {
    switch (action.type) {
        case HOLIDAY_RECEIVE_DATA:
            state = action.data;
            return state;
        default:
            return state;
    }
};

export default dataReducer;