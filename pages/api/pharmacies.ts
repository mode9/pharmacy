import type {NextApiRequest, NextApiResponse, } from 'next';

import {APIMetaType, HttpMethod} from './_api';
import {readFromJson} from '../../core/utils';
import {PharmacyData} from "../../core/types";

export type PharmacyAPIResult = {
  meta: APIMetaType,
  data: PharmacyData[] | [],
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<PharmacyAPIResult>
  ) {
  const method: string = req.method ? req.method : HttpMethod.GET;
  if (req.headers.authorization !== process.env.AUTH_KEY) {
    return res.status(401).json({meta: {status: 401, action: method}, data: []});
  }
  const result: PharmacyAPIResult = {
    meta: {
      status: 200,
      action: method,
    },
    data: [],
  }
  try {
   result.data = readFromJson();
   res
       .status(200)
       .json(result)
   ;
  } catch (e) {
    console.log(e);
    const statusCode = 400;
    result.meta.status = statusCode;
    res.status(statusCode).json(result);
  }
}