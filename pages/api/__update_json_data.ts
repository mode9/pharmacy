import type { NextApiRequest, NextApiResponse } from 'next';
import readFromCSV from '../../core/csv';
import { savePharmacyData } from '../../core/utils';

async function handler (
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    const data = await readFromCSV();
    const new_data = await savePharmacyData(data);
    res
        .status(200)
        .json({'msg': `${new_data.length} pharmacies updated`, result: new_data})
    ;
}

export default handler;