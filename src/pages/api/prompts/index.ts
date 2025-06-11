import type { NextApiRequest, NextApiResponse } from 'next';
import { Prompt } from '../models/prompt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST':
        return await handlePost(req, res);
      case 'GET':
        return await handleGet(res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, template } = req.body;

  if (!title?.trim() || !template?.trim()) {
    return res.status(400).json({ error: 'Title and template are required.' });
  }

  const newPrompt = await Prompt.create({
    title,
    template,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return res.status(201).json(newPrompt);
};

const handleGet = async (res: NextApiResponse) => {
  const prompts = await Prompt.findAll({ order: [['createdAt', 'DESC']] });
  return res.status(200).json(prompts);
};
