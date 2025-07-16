import React, { useEffect, useRef, useState } from 'react';
import styles from './SequenceDiagram.module.scss';

interface SequenceDiagramProps {
  diagram: string;
}

const SequenceDiagram: React.FC<SequenceDiagramProps> = ({ diagram }) => {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSource, setShowSource] = useState(false);
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    const renderDiagram = async () => {
      const container = diagramRef.current;
      if (!container) return;

      try {
        setIsLoading(true);
        setError(null);
        const mermaid = (await import('mermaid')).default;
        // Initialize mermaid
        mermaid.initialize({
          startOnLoad: true,
          theme: 'default',
          securityLevel: 'loose',
          sequence: {
            width: 80,
            height: 40,
            boxMargin: 6,
            boxTextMargin: 4,
            noteMargin: 8,
            messageMargin: 25,
            mirrorActors: true,
            bottomMarginAdj: 1,
            useMaxWidth: true,
          }
        });

        const id = `sequence-diagram-${Math.random().toString(36).substr(2, 9)}`;
        const diagramWithDeclaration = `sequenceDiagram\n${diagram}`;

        const { svg } = await mermaid.render(id, diagramWithDeclaration);
        container.innerHTML = svg;
        setSvgContent(svg);
      } catch (err) {
        console.error('序列图渲染错误:', err);
        setError(err instanceof Error ? err.message : '序列图渲染失败');
      } finally {
        setIsLoading(false);
      }
    };

    if (!showSource) {
      renderDiagram();
    }
  }, [diagram, showSource]);

  const handleDownload = () => {
    if (!svgContent) return;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sequence-diagram.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>序列图渲染失败: {error}</p>
        <pre className={styles.errorCode}>{diagram}</pre>
      </div>
    );
  }

  return (
    <div className={styles.diagramContainer}>
      <div className={styles.diagramHeader}>
        <div className={styles.diagramActions}>
          <button
            onClick={() => setShowSource(!showSource)}
            className={styles.actionButton}
            title={showSource ? "显示图表" : "显示源代码"}
          >
            {showSource ? '图片' : '源码' }
          </button>
          {!showSource && (
            <button
              onClick={handleDownload}
              className={styles.actionButton}
              title="下载图片"
            >
              下载
            </button>
          )}
        </div>
      </div>

      {showSource ? (
        <pre className={styles.sourceCode}>
          <code>{diagram}</code>
        </pre>
      ) : (
        <>
          {isLoading && (
            <div className={styles.loading}>
              <div className={styles.loadingDots}>
                <div className={styles.loadingDot}></div>
                <div className={styles.loadingDot}></div>
                <div className={styles.loadingDot}></div>
              </div>
              <div className={styles.loadingText}>正在渲染序列图...</div>
            </div>
          )}
          <div ref={diagramRef} className={styles.diagram} />
        </>
      )}
    </div>
  );
};

export default SequenceDiagram; 