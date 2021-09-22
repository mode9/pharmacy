import type {NextApiRequest, NextApiResponse} from 'next';


import Pharmacy from '../../core/pharmacies';
import {APIMetaType, HttpMethod} from './_api';
import {readFromJson} from '../../core/utils';


export type PharmacyAPIResult = {
  meta: APIMetaType,
  data: Pharmacy[] | [],
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PharmacyAPIResult>
  ) {
  const method: string = req.method ? req.method : HttpMethod.GET;
  const result: PharmacyAPIResult = {
    meta: {
      status: 200,
      next: `http://${req.headers.host}${req.url}`,
      action: method,
    },
    data: [],
  }
  try {
   result.data = readFromJson().map((data) => new Pharmacy(data));
    // await sleep(1000);
    res
      .status(200)
      .json(result)
    ;
    // res.status(200).json(result.filter((pharmacy) => pharmacy.isOpen()));
  } catch (e) {
    console.log(e);
    const statusCode = 400;
    result.meta.status = statusCode;
    res.status(statusCode).json(result);
  }
}