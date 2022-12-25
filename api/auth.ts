import type { VercelRequest, VercelResponse } from '@vercel/node';
import { auth } from '../src/controllers/auth';

export default async (req: VercelRequest, res: VercelResponse) => {
  auth(req, res)
};
