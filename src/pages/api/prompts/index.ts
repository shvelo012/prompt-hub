import type { NextApiRequest, NextApiResponse } from 'next';
import { Prompt } from '../models/prompt';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, template } = req.body;
    if (!title || !template) return res.status(400).json({ error: 'Missing fields' });

    const prompt = await Prompt.create({ 
      title, 
      template, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    });
    res.status(201).json(prompt);
  } else if (req.method === 'GET') {
    const prompts = await Prompt.findAll();
    res.status(200).json(prompts);
  }
}
