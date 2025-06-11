import styles from '../styles/Home.module.css';

interface PromptCardProps {
  prompt: { id: number; title: string; template: string };
  inputValues: { [key: string]: string };
  onInputChange: (key: string, value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  response?: string;
}

const extractVariables = (template: string): string[] => {
  const matches = template.match(/{(.*?)}/g);
  return matches ? matches.map(v => v.replace(/[{}]/g, '')) : [];
};

export default function PromptCard({
  prompt,
  inputValues,
  onInputChange,
  onSubmit,
  loading,
  response,
}: PromptCardProps) {
  return (
    <div className={styles.promptCard}>
      <h3>{prompt.title}</h3>
      <p><strong>Template:</strong> {prompt.template}</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const variables = extractVariables(prompt.template);
          const hasEmpty = variables.some((v) => !inputValues[v]?.trim());
          if (hasEmpty) {
            alert('Please fill in all fields.');
            return;
          }
          onSubmit();
        }}
      >

        {extractVariables(prompt.template).map((variable) => (
          <div key={variable} className={styles.variableRow}>
            <label className={styles.label}>{variable}:</label>
            <input
              value={inputValues[variable] || ''}
              onChange={(e) => onInputChange(variable, e.target.value)}
              className={styles.inputVariable}
            />
          </div>
        ))}
        <button type="submit" className={styles.button}>
          {loading ? 'Loading...' : 'Execute'}
        </button>
      </form>

      {response && !loading && (
        <div className={styles.responseBox}>
          <p><strong>AI Response:</strong></p>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
