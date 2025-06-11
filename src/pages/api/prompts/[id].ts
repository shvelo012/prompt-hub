import type { NextApiRequest, NextApiResponse } from 'next';
import { Prompt } from '../models/prompt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const prompt = await Prompt.findByPk(id as string);
  if (!prompt) return res.status(404).json({ error: 'Not found' });

  res.status(200).json(prompt);
}
