import type { NextApiRequest, NextApiResponse } from 'next';
import spacetime from 'spacetime';
import { Spacetime } from 'spacetime/types/types';


import Pharmacy from '../../core/pharmacies';
import { APIMetaType, HttpMethod } from './_api';
import {sleep, readFromJson} from '../../core/utils';
import { prisma } from '../../core/db';


export type PharmacyAPIResult = {
  meta: APIMetaType,
  data: Pharmacy[],
}


async function saveOpeningHour (item: Pharmacy) {

  const arrWeekName: Array<keyof Pharmacy> = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'holiday'];
  let category, st, opening, openingSec, closing, closingSec;

  arrWeekName.forEach(async (category) => {
    st = spacetime();
    var foo = item[category];
    if (foo && typeof foo === 'object') {
      opening = st.time(foo.opening);
      let openingSec: number = (opening.hour() * 3600) + (opening.minute() * 60);
      closing = st.time(foo.closing);
      closingSec = (closing.hour() * 3600) + (closing.minute() * 60);
      await prisma.openingHour.create({
        data: {
          pharmacyId: item.id,
          category: category,
          opening: openingSec,
          closing: closingSec,
        }
      })  
    }
    
  })
  for (let i=0; i < arrWeekName.length; i++) {
    
  }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PharmacyAPIResult>
  ) {
  try {
    if (req.method === 'POST') {
      console.log(req)
      return res
          .status(200)
          .json({msg: 'success'})
      ;
    }
    console.log('start api');

    const pharmacies: Pharmacy[] = readFromJson().map((data) => new Pharmacy(data));
    const page: string = req.query.page ? req.query.page : 1;
    const pageNum: number = parseInt(page) || 1;
    // const startIdx: number = (pageNum-1) * 20;
    // const endIdx: number = pageNum * 20;
    const data: Pharmacy[] = pharmacies;

    var category, st, closing, opening, bar;

    for (let i=0; i < data.length; i++) {
      const item = data[i];
      var foo = await prisma.pharmacy.findFirst({
        where: {
          phone: item.phone,
        }
      });
      if (!foo) {
        const pharmacy = await prisma.pharmacy.create({
          data: {
            name: item.name,
            phone: item.phone,
            address: item.address,
            address_road: item.address_road
          }
        });
        console.log('none exists')

      }
    }
    const result: PharmacyAPIResult = {
      meta: {
        status: 200,
        next: `http://${req.headers.host}/api/pharmacies?page=${pageNum}`,
        action: HttpMethod.GET,
        pageNum,
      },
      data: await prisma.pharmacy.findMany(),
    }
    // await sleep(1000);
    res
      .status(200)
      .json(result)
    ;
    // res.status(200).json(result.filter((pharmacy) => pharmacy.isOpen()));
  } catch (e) {
    console.log(e);
    res.status(400).json({msg: 'failed'});
  }
}