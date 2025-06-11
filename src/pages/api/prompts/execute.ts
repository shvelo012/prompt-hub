// /pages/api/prompts/execute.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { Prompt } from '../models/prompt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { promptId, variables } = req.body;

  const prompt = await Prompt.findByPk(promptId);
  if (!prompt) return res.status(404).json({ error: 'Prompt not found' });

  const filled = prompt.template.replace(/{(.*?)}/g, (_, key) => variables[key.trim()] || '');

  const aiRes = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: filled }],
  });

  res.status(200).json({ result: aiRes.choices[0].message?.content });
}
