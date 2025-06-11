'use client';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import PromptForm from '../components/PromptForm';
import PromptCard from '../components/PromptCard';

interface Prompt {
  id: number;
  title: string;
  template: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [newPrompt, setNewPrompt] = useState({ title: '', template: '' });
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [inputs, setInputs] = useState<{ [key: number]: { [key: string]: string } }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetch('/api/prompts').then((res) => res.json()).then(setPrompts);
  }, []);

  const handleInputChange = (promptId: number, key: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [promptId]: { ...prev[promptId], [key]: value },
    }));
  };

  const executePrompt = async (promptId: number) => {
    const variables = inputs[promptId] || {};
    setLoading((prev) => ({ ...prev, [promptId]: true }));
    try {
      const res = await fetch('/api/prompts/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId, variables }),
      });
      const data = await res.json();
      setResponses((prev) => ({ ...prev, [promptId]: data.result }));
    } catch {
      setResponses((prev) => ({ ...prev, [promptId]: 'Error fetching AI response' }));
    } finally {
      setLoading((prev) => ({ ...prev, [promptId]: false }));
    }
  };

  const createPrompt = async () => {
    const res = await fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPrompt),
    });
    const data = await res.json();
    setPrompts((prev) => [...prev, data]);
    setNewPrompt({ title: '', template: '' });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🧠 Prompt Hub</h1>

      <PromptForm
        title={newPrompt.title}
        template={newPrompt.template}
        onChange={(field, value) => setNewPrompt({ ...newPrompt, [field]: value })}
        onCreate={createPrompt}
      />

      <h2 className={styles.subtitle}>Saved Prompts</h2>
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          inputValues={inputs[prompt.id] || {}}
          onInputChange={(key, value) => handleInputChange(prompt.id, key, value)}
          onSubmit={() => executePrompt(prompt.id)}
          loading={loading[prompt.id]}
          response={responses[prompt.id]}
        />
      ))}
    </div>
  );
}
