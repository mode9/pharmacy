import spacetime from 'spacetime';
import { sleep } from './utils.js';
import OpeningHours, { TIMEZONE } from './times';
import type { PharmacyData } from './types';


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
  }

  getOpeningHour(weekDay: number): OpeningHours {
    return {
      0: this.monday,
      1: this.tuesday,
      2: this.wednesday,
      3: this.thursday,
      4: this.friday,
      5: this.saturday,
      6: this.sunday,
    }[weekDay] || this.holiday;
  }

  todayOpeningHour(holiday: boolean = false): OpeningHours {
    const weekDay: number = holiday ? -1 : spacetime.now(TIMEZONE).day();
    return this.getOpeningHour(weekDay);
  }

  isOpen(holiday: boolean = false): boolean {
    return this.todayOpeningHour(holiday).isOpen();
  }
}

