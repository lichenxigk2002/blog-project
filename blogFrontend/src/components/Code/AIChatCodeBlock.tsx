import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from './CodeBlock.module.scss';

interface AIChatCodeBlockProps {
  language: string;
  value: string;
}

const AIChatCodeBlock = ({ language, value }: AIChatCodeBlockProps) => {
  return (
    <div className={styles.codeBlock} style={{ margin: '0.7em 0', borderRadius: 8, fontSize: '0.92em' }}>
      <div className={styles.codeHeader} style={{ padding: '0.35em 0.9em', fontSize: '0.78em' }}>
        <span className={`${styles.language} ${styles[`language-${language.toLowerCase()}`]}`}>{(language || 'text').toLowerCase()}</span>
      </div>
      <div className={styles.codeContent} style={{ padding: 0 }}>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers={false}
          wrapLines={true}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 8px 8px',
            padding: '0.7em 1em',
            background: 'var(--code-block-bg, #23272e)',
            fontSize: 'inherit',
            lineHeight: 1.6
          }}
          codeTagProps={{
            style: {
              fontFamily: 'Menlo, Monaco, Consolas, monospace',
              whiteSpace: 'pre',
              wordBreak: 'break-all'
            }
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default AIChatCodeBlock; 