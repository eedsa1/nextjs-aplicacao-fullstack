// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';

interface ResponseType {
  message: string;
}
export default (req: NextApiRequest, res: NextApiResponse<ResponseType>): void => {
  res.status(200).json({ message: "a api funciona!" });
}
