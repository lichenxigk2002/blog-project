import React, { useEffect, useRef, useState } from 'react';
import styles from './MermaidDiagram.module.scss';
import { FiCode, FiImage, FiDownload, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface MermaidDiagramProps {
    diagram: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ diagram }) => {
    // 1. 定义 ref、状态
    const diagramRef = useRef<HTMLDivElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldShowExpand, setShouldShowExpand] = useState(false);
    const [showSource, setShowSource] = useState(false);
    const [svgContent, setSvgContent] = useState('');
    const [error, setError] = useState<string | null>(null);

    // 2. 最大高度
    const MAX_HEIGHT = '300px';

    const getMermaidTheme = () => {
        if (typeof window !== 'undefined') {
            if (document.documentElement.dataset.theme === 'dark') return 'dark';
        }
        return 'default';
    };

    // 3. 渲染 mermaid 图表
    useEffect(() => {
        if (showSource) return;
        const renderDiagram = async () => {
            const container = diagramRef.current;
            if (!container) return;
            try {
                const mermaid = (await import('mermaid')).default;
                mermaid.initialize({ startOnLoad: false, theme: getMermaidTheme(), securityLevel: 'loose' });
                const id = `mermaid-diagram-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, diagram);
                container.innerHTML = svg;
                setSvgContent(svg);
            } catch (err) {
                setError('渲染失败: ' + (err instanceof Error ? err.message : '未知错误'));
            }
        };
        renderDiagram();
    }, [diagram, showSource]);

    // 4. 判断是否需要展开按钮
    useEffect(() => {
        if (diagramRef.current) {
            const contentHeight = diagramRef.current.scrollHeight;
            const maxHeightPx = parseInt(MAX_HEIGHT, 10);
            setShouldShowExpand(contentHeight > maxHeightPx);
        }
    }, [svgContent]);

    // 5. 下载功能
    const handleDownload = () => {
        if (!svgContent) return;
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mermaid-diagram.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // 6. 展开/收起
    const toggleExpand = () => setIsExpanded(!isExpanded);

    // 7. 错误处理
    if (error) {
        return <div className={styles.errorContainer}>{error}<pre>{diagram}</pre></div>;
    }

    // 8. 组件渲染
    return (
        <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
                <span className={styles.language}>mermaid</span>
                <div className={styles.buttonGroup}>
                    <button className={styles.copyButton} onClick={() => setShowSource(!showSource)}>
                        {showSource ? (
                            <>
                                <FiImage style={{ fontSize: '0.9em', marginRight: 4 }} />
                                <span style={{ fontSize: '0.85em' }}>图片</span>
                            </>
                        ) : (
                            <>
                                <FiCode style={{ fontSize: '0.9em', marginRight: 4 }} />
                                <span style={{ fontSize: '0.85em' }}>源码</span>
                            </>
                        )}
                    </button>
                    {!showSource && (
                        <button className={styles.copyButton} onClick={handleDownload}>
                            <FiDownload style={{ fontSize: '0.9em', marginRight: 4 }} />
                            <span style={{ fontSize: '0.85em' }}>下载</span>
                        </button>
                    )}
                    {shouldShowExpand && (
                        <button className={styles.expandButton} onClick={toggleExpand}>
                            {isExpanded ? (
                                <>
                                    <FiChevronUp style={{ fontSize: '1em', marginRight: 4 }} />
                                    <span style={{ fontSize: '0.85em' }}>收起</span>
                                </>
                            ) : (
                                <>
                                    <FiChevronDown style={{ fontSize: '1em', marginRight: 4 }} />
                                    <span style={{ fontSize: '0.85em' }}>展开</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
            <div
                className={styles.codeContent}
                style={{
                    maxHeight: isExpanded ? 'none' : MAX_HEIGHT,
                    overflow: isExpanded ? 'visible' : 'auto'
                }}
            >
                {showSource ? (
                    <pre className={styles.sourceCode}><code>{diagram}</code></pre>
                ) : (
                    <div ref={diagramRef} className={styles.diagram} />
                )}
            </div>
        </div>
    );
};

export default MermaidDiagram;