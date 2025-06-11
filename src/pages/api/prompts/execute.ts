import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { Prompt } from '../models/prompt';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { promptId, variables } = req.body;

    if (!promptId || !variables) {
      return res.status(400).json({ error: 'Missing required fields: promptId or variables' });
    }

    const prompt = await Prompt.findByPk(promptId);
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    const filled = prompt.template.replace(/{(.*?)}/g, (_, key) => variables[key.trim()] || '');

    const aiRes = await client.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [{ role: 'user', content: filled }],
    });

    const response = aiRes.choices?.[0]?.message?.content;

    if (!response) {
      return res.status(500).json({ error: 'No valid response from OpenAI' });
    }

    res.status(200).json({ result: response });
  } catch (error: any) {
    console.error('Error executing prompt:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
