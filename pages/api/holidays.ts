import type {NextApiRequest, NextApiResponse} from 'next';

import {HttpMethod} from './_api';
import {getAllHolidays} from '../../core/utils';
import {HolidayAPIResult} from "../../core/types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<HolidayAPIResult>
) {
    const method: string = req.method ? req.method : HttpMethod.GET;
    if (req.headers.authorization !== process.env.AUTH_KEY) {
        return res.status(401).json({meta: {status: 401, action: method}, data: []});
    }
    const result: HolidayAPIResult = {
        meta: {
            status: 200,
            action: method,
        },
        data: [],
    }
    try {
        result.data = getAllHolidays();
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