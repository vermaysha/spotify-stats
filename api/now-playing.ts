import type { VercelRequest, VercelResponse } from '@vercel/node';
import { nowPlaying } from '../src/controllers/nowPlaying';

export default (req: VercelRequest, res: VercelResponse) => {
  return nowPlaying(req, res)
};
