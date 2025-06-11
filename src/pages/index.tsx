'use client'
import { useEffect, useState } from 'react';
import styles from './../styles/Home.module.css';

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
    fetch('/api/prompts')
      .then((res) => res.json())
      .then(setPrompts);
  }, []);

  const extractVariables = (template: string): string[] => {
    const matches = template.match(/{(.*?)}/g);
    return matches ? matches.map(v => v.replace(/[{}]/g, '')) : [];
  };

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
    } catch (error) {
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

      <section className={styles.createSection}>
        <h2>Create a New Prompt</h2>
        <input
          placeholder="Title"
          value={newPrompt.title}
          onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
          className={styles.input}
        />
        <textarea
          placeholder="Template (e.g., Translate {text} to {language})"
          value={newPrompt.template}
          onChange={(e) => setNewPrompt({ ...newPrompt, template: e.target.value })}
          className={styles.textarea}
        />
        <button onClick={createPrompt} className={styles.button}>
          Create Prompt
        </button>
      </section>

      <h2 className={styles.subtitle}>Saved Prompts</h2>
      {prompts.map((prompt) => (
        <div key={prompt.id} className={styles.promptCard}>
          <h3>{prompt.title}</h3>
          <p><strong>Template:</strong> {prompt.template}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              executePrompt(prompt.id);
            }}
          >
            {extractVariables(prompt.template).map((variable) => (
              <div key={variable} className={styles.variableRow}>
                <label className={styles.label}>{variable}:</label>
                <input
                  value={inputs[prompt.id]?.[variable] || ''}
                  onChange={(e) => handleInputChange(prompt.id, variable, e.target.value)}
                  className={styles.inputVariable}
                />
              </div>
            ))}
            <button type="submit" className={styles.button}>
              {loading[prompt.id] ? 'Loading...' : 'Execute'}
            </button>
          </form>

          {responses[prompt.id] && !loading[prompt.id] && (
            <div className={styles.responseBox}>
              <p><strong>AI Response:</strong></p>
              <p>{responses[prompt.id]}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
