import * as path from 'path';
import * as csv from 'fast-csv';
import { stringToTimeObject } from '../core/times';
import type { CsvRowType, PharmacyData } from '../core/types';


var fs = require('fs');

function parseCsvData(csv: CsvRowType) {
  return {
    name: csv['약국명'],
    phone: csv['대표전화'],
    address_road: csv['도로명주소'],
    address: csv['지번주소'],
    monday: stringToTimeObject(csv['월요일']),
    tuesday: stringToTimeObject(csv['화요일']),
    wednesday: stringToTimeObject(csv['수요일']),
    thursday: stringToTimeObject(csv['목요일']),
    friday: stringToTimeObject(csv['금요일']),
    saturday: stringToTimeObject(csv['토요일']),
    sunday: stringToTimeObject(csv['일요일']),
    holiday: stringToTimeObject(csv['공휴일']),
  }
}


// async function readFromCSV (): Promise<PharmacyData[]> {
//   let arrData: PharmacyData[] = [];
//   return new Promise((resolve, reject) => {
//     fs.createReadStream(path.resolve(process.cwd(), 'data.csv'))
//       .pipe(csv.parse({ headers: true }))
//       .on('error', (error: any) => reject(error))
//       .on('data', (row: PharmacyData) => arrData.push(parseCsvData(row)))
//       .on('end', () => resolve(arrData));
//   })
// }

// export default readFromCSV;
export { parseCsvData };