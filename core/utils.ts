import * as path from 'path';
import spacetime from "spacetime";
import type {Holiday, PharmacyData} from './types';


export async function sleep(ms: number): Promise<null> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function readFromJson(): PharmacyData[] {
  var fs = require('fs');
  const filename: string = path.resolve(process.cwd(), 'data_new.json');
  const rawData = fs.readFileSync(filename, 'utf-8');
  var data = JSON.parse(rawData);
  for (let i=0; i < data.length; i++) {
    data[i].id = i;
  }
  var jsonData = JSON.stringify(data);
  fs.writeFileSync(filename, jsonData);

  return data
}

export function getAllHolidays(): Holiday[] {
  var fs = require('fs');
  const filename: string = path.resolve(process.cwd(), 'holidays.json');
  const rawData = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(rawData);
}

export function isHoliday(holidays: Holiday[]): boolean {
  const today = spacetime.today('Asia/Seoul');
  return holidays.filter((holiday) => {
    return today.isEqual(spacetime(holiday.start, 'Asia/Seoul'));
  }).length > 0;
}

