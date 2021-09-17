import * as path from 'path';
import type { PharmacyData } from './types';

var fs = require('fs');


type Coords = {
  x: number;
  y: number;
}

export async function sleep(ms: number): Promise<null> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function getCoordsFromAddr(address: string | undefined) {
  if (!address) return {};
  const kakaoKey = '3b475a194f92641ce4f9a013230e1774';
  const encodedAddr = encodeURI(address);
  const url = `http://dapi.kakao.com/v2/local/search/address.json?page=1&size=10&query=${encodedAddr}`;
  // TODO: origin HOST?
  const options = {
    method: 'GET',
    headers: {
      Authorization: `KakaoAK ${kakaoKey}`,
      KA: 'sdk/4.4.1 os/javascript lang/ko-KR device/MacIntel origin/http%3A%2F%2Flocalhost%3A3000',
    }
  }
  return await fetch(url, options)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return {};
        }
      })
      .then(data => {
        let result = {};
        if (data.documents && data.documents.length) {
          const addrInfo = data.documents[0];
          result = {
            x: addrInfo.x,
            y: addrInfo.y
          }
        }
        return result;

      });
}

export async function savePharmacyData(data: PharmacyData[]) {
  const new_data = await Promise.all(data.map(async (object): Promise<PharmacyData> => {
    const coords = await getCoordsFromAddr(object.address_road || object.address);
    return Object.assign(object, coords);
  }));
  const jsonData: string = JSON.stringify(new_data);
  const filename: string = path.resolve(process.cwd(), 'data_new.json');
  fs.writeFileSync(filename, jsonData);

  return new_data;
}

export function readFromJson(): PharmacyData[] {
  const filename: string = path.resolve(process.cwd(), 'data.json');
  const rawData = fs.readFileSync(filename, 'utf-8');
  return JSON.parse(rawData);
}