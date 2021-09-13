// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/database';

interface ErrorResponseType {
  error: string;
}

interface SuccessResponseType {
  _id: string;
  name: string;
  email: string;
  cellphone: string;
  teacher: true;
  coins: 1;
  courses: string[];
  available_hours: object;
  available_locations: string[];
  reviews: object[];
  appointments: object[];
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  if (req.method === 'GET') {
    const { email } = req.query;

    //res.status(200).json({ email });
    //return;
    if (!email) {
      res.status(400).json({ error: 'Missing email!' });
      return;
    }
    const { db } = await connect();

    const response = await db.collection('users').findOne({ email });

    if (!response) {
      res.status(400).json({ error: `User with ${email} not found!` });
      return;
    }

    res.status(200).json(response);
  } else {
    res.status(400).json({ error: 'erro ao processar a requisição' });
  }
};
