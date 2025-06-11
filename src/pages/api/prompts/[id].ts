import type { NextApiRequest, NextApiResponse } from 'next';
import { Prompt } from '../models/prompt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    const prompt = await Prompt.findByPk(id as string);

    if (!prompt) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.status(200).json(prompt);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
