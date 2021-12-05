import * as path from 'path';
import spacetime from "spacetime";
import type { PharmacyData, Holiday } from './types';


export async function sleep(ms: number): Promise<null> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function readFromJson(): PharmacyData[] {
  var fs = require('fs');
  const filename: string = path.resolve(process.cwd(), 'data_new.json');
  const rawData = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(rawData);
}

export function getAllHolidays(): Holiday[] {
  var fs = require('fs');
  const filename: string = path.resolve(process.cwd(), 'holidays.json');
  const rawData = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(rawData);
}

export function isHoliday(): boolean {
  const holidays: Holiday[] = getAllHolidays();
  const today = spacetime.today('Asia/Seoul');
  return holidays.filter((holiday) => {
    return today.isEqual(spacetime(holiday.start, 'Asia/Seoul'));
  }).length > 0;
}

