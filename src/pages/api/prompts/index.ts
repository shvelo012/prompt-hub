import type { NextApiRequest, NextApiResponse } from 'next';
import { Prompt } from '../models/prompt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { title, template } = req.body;
      if (!title || !template) {
        return res.status(400).json({ error: 'Missing fields' });
      }

      const prompt = await Prompt.create({ 
        title, 
        template, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      });
      return res.status(201).json(prompt);
    } else if (req.method === 'GET') {
      const prompts = await Prompt.findAll();
      return res.status(200).json(prompts);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
