import spacetime from 'spacetime';
import OpeningHours, { TIMEZONE } from './times';
import type { PharmacyData } from './types';
import {humanizeDistance} from "./mapManager/helpers";
import {LatLngInterface} from "./mapManager/types";
import {pharmacyFilterType} from "./reducers/types";


export default class Pharmacy {
  name: string;
  phone: string;
  address_road?: string;
  address?: string;
  monday: OpeningHours;
  tuesday: OpeningHours;
  wednesday: OpeningHours;
  thursday: OpeningHours;
  friday: OpeningHours;
  saturday: OpeningHours;
  sunday: OpeningHours;
  holiday: OpeningHours;
  x: number;
  y: number;
  id: number;
  loading: boolean = true;

  constructor (data: PharmacyData) {
    this.name = data.name;
    this.phone = data.phone;
    this.address_road = data.address_road;
    this.address = data.address;
    this.monday = new OpeningHours(data.monday);
    this.tuesday = new OpeningHours(data.tuesday);
    this.wednesday = new OpeningHours(data.wednesday);
    this.thursday = new OpeningHours(data.thursday);
    this.friday = new OpeningHours(data.friday);
    this.saturday = new OpeningHours(data.saturday);
    this.sunday = new OpeningHours(data.sunday);
    this.holiday = new OpeningHours(data.holiday);
    this.x = data.x;
    this.y = data.y;
    this.id = data.id;
  }

  getOpeningHour(weekDay: number): OpeningHours {
    return {
      0: this.sunday,
      1: this.monday,
      2: this.tuesday,
      3: this.wednesday,
      4: this.thursday,
      5: this.friday,
      6: this.saturday,
    }[weekDay] || this.holiday;
  }

  todayOpeningHour(holiday: boolean = false): OpeningHours {
    // TODO: 00시 지난 경우, 다음날짜의 영업시간이 적용됨. 예. 월요일 0시 1분은 일요일이 아닌 월요일 날짜가 적용되어 보임.
    let now = spacetime.now(TIMEZONE);
    if (now.hour() < 6) {
      now = now.subtract(1, 'date');
    }
    const weekDay: number = holiday ? -1 : now.day();
    return this.getOpeningHour(weekDay);
  }

  isOpen(holiday: boolean = false): boolean {
    return this.todayOpeningHour(holiday).isOpen();
  }

  humanizedDistance (destination: LatLngInterface): string {
    return humanizeDistance(this.y, this.x, destination.lat(), destination.lng());
  }

  toObject (): PharmacyData {
    return {
      name: this.name,
      phone: this.phone,
      address_road: this.address_road,
      address: this.address,
      monday: {opening: this.monday.opening, closing: this.monday.closing},
      tuesday: {opening: this.tuesday.opening, closing: this.tuesday.closing},
      wednesday: {opening: this.wednesday.opening, closing: this.wednesday.closing},
      thursday: {opening: this.thursday.opening, closing: this.thursday.closing},
      friday: {opening: this.friday.opening, closing: this.friday.closing},
      saturday: {opening: this.saturday.opening, closing: this.saturday.closing},
      sunday: {opening: this.sunday.opening, closing: this.sunday.closing},
      holiday: {opening: this.holiday.opening, closing: this.holiday.closing},
      x: this.x,
      y: this.y,
      id: this.id,
    }
  }
}


export function filterPharmacies(pharmacies: Pharmacy[], options: pharmacyFilterType): Pharmacy[] {
  return pharmacies.filter(row => {
    let inBounds = options.bounds?.hasLatLng({lat: row.y, lng: row.x});
    if (options.showClosed) {
      return inBounds;
    }
    return inBounds && row.isOpen(options.isHoliday);
  });
}