'use client'
import { useEffect, useState } from 'react';

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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>🧠 Prompt Hub</h1>

      <section style={{ marginBottom: '2rem', padding: '1.5rem', borderRadius: '12px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2>Create a New Prompt</h2>
        <input
          placeholder="Title"
          value={newPrompt.title}
          onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <textarea
          placeholder="Template (e.g., Translate {text} to {language})"
          value={newPrompt.template}
          onChange={(e) => setNewPrompt({ ...newPrompt, template: e.target.value })}
          style={{ width: '100%', padding: '0.5rem', minHeight: '80px', marginBottom: '1rem' }}
        />
        <button onClick={createPrompt} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Create Prompt</button>
      </section>

      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Saved Prompts</h2>
      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          style={{
            border: '1px solid #ddd',
            padding: '1.5rem',
            marginBottom: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            backgroundColor: '#fff',
          }}
        >
          <h3>{prompt.title}</h3>
          <p><strong>Template:</strong> {prompt.template}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              executePrompt(prompt.id);
            }}
          >
            {extractVariables(prompt.template).map((variable) => (
              <div key={variable} style={{ marginBottom: '0.5rem' }}>
                <label style={{ marginRight: '0.5rem' }}>{variable}:</label>
                <input
                  value={inputs[prompt.id]?.[variable] || ''}
                  onChange={(e) => handleInputChange(prompt.id, variable, e.target.value)}
                  style={{ padding: '0.4rem', width: '70%' }}
                />
              </div>
            ))}
            <button type="submit" style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
              {loading[prompt.id] ? 'Loading...' : 'Execute'}
            </button>
          </form>

          {responses[prompt.id] && !loading[prompt.id] && (
            <div style={{ marginTop: '1rem', backgroundColor: '#f1f1f1', padding: '1rem', borderRadius: '8px' }}>
              <p><strong>AI Response:</strong></p>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{responses[prompt.id]}</pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
