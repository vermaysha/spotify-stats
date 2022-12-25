import type { VercelRequest, VercelResponse } from '@vercel/node';
import { topPlayed } from '../src/controllers/topPlayed';

export default (req: VercelRequest, res: VercelResponse) => {
  return topPlayed(req, res)
};
