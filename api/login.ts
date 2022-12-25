import type { VercelRequest, VercelResponse } from '@vercel/node';
import { login } from '../src/controllers/login';

export default (req: VercelRequest, res: VercelResponse) => {
  return login(req, res)
};
