import styles from '../styles/Home.module.css';

interface PromptFormProps {
  title: string;
  template: string;
  onChange: (field: 'title' | 'template', value: string) => void;
  onCreate: () => void;
}

export default function PromptForm({ title, template, onChange, onCreate }: PromptFormProps) {
  return (
    <section className={styles.createSection}>
      <h2>Create a New Prompt</h2>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => onChange('title', e.target.value)}
        className={styles.input}
      />
      <textarea
        placeholder="Template (e.g., Translate {text} to {language})"
        value={template}
        onChange={(e) => onChange('template', e.target.value)}
        className={styles.textarea}
      />
      <button onClick={onCreate} className={styles.button}>Create Prompt</button>
    </section>
  );
}
