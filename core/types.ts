import Pharmacy from "./pharmacies";
import {APIMetaType} from "../pages/api/_api";

type CsvRowType = {
  약국명: string;
  대표전화: string;
  도로명주소: string;
  지번주소: string;
  월요일: string;
  화요일: string;
  수요일: string;
  목요일: string;
  금요일: string;
  토요일: string;
  일요일: string;
  공휴일: string;
  [key: string]: string;
};


type PharmacyData = {
  name: string;
  phone: string;
  address_road?: string;
  address?: string;
  monday: OpeningHoursType;
  tuesday: OpeningHoursType;
  wednesday: OpeningHoursType;
  thursday: OpeningHoursType;
  friday: OpeningHoursType;
  saturday: OpeningHoursType;
  sunday: OpeningHoursType;
  holiday: OpeningHoursType;
  x: number;
  y: number;
  id: number;
  isOpen: () => boolean;
  isHoliday?: boolean;
  [key: string]: string | number | OpeningHoursType | undefined | Function | boolean;
};

type OpeningHoursType = {
  opening: string;
  closing: string;
  [key: string]: string;
};

type PharmacyItemType = Pharmacy & {
  loading?: boolean;
  marker?: any;
};

type Holiday = {
  start: string;
  summary: string;
}
type PharmacyAPIResult = {
  meta: APIMetaType,
  data: PharmacyData[] | [],
}
type HolidayAPIResult = {
  meta: APIMetaType,
  data: Holiday[] | [],
}

type MapCenter = {
  x: number;
  y: number;
}
export type { OpeningHoursType, CsvRowType, PharmacyData, PharmacyItemType, Holiday, PharmacyAPIResult, HolidayAPIResult, MapCenter };
