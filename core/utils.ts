import * as path from 'path';
import type { PharmacyData } from './types';

var fs = require('fs');


export async function sleep(ms: number): Promise<null> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function readFromJson(): PharmacyData[] {
  const filename: string = path.resolve(process.cwd(), 'data_new.json');
  const rawData = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(rawData);
}