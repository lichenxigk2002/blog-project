import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { FiCopy, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from './CodeBlock.module.scss';

interface CodeBlockProps {
    language: string;
    value: string;
}

const CodeBlock = ({ language, value }: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldShowExpand, setShouldShowExpand] = useState(false);
    const codeContentRef = useRef<HTMLDivElement>(null);
    // 设置代码块的最大高度
    const MAX_HEIGHT = '300px';
    const [maxHeight, setMaxHeight] = useState<string>(MAX_HEIGHT);

    useEffect(() => {
        if (codeContentRef.current) {
            const contentHeight = codeContentRef.current.scrollHeight;
            const maxHeightPx = parseInt(MAX_HEIGHT, 10);
            setShouldShowExpand(contentHeight > maxHeightPx);
            // 动画用
            if (isExpanded) {
                setMaxHeight(contentHeight + 'px');
            } else {
                setMaxHeight(MAX_HEIGHT);
            }
        }
    }, [value, isExpanded]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
                <span className={`${styles.language} ${styles[`language-${language.toLowerCase()}`]}`}>{(language || 'text').toLowerCase()}</span>
                <div className={styles.buttonGroup}>
                    <button className={styles.copyButton} onClick={handleCopy}>
                        <FiCopy style={{ fontSize: '0.9em', marginRight: 4 }} />
                        <span style={{ fontSize: '0.85em' }}>{copied ? '已复制' : '复制'}</span>
                    </button>
                    {shouldShowExpand ? (
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
                    ) : null}
                </div>
            </div>
            <div
                ref={codeContentRef}
                className={styles.codeContent}
                style={{
                    maxHeight: isExpanded ? maxHeight : maxHeight,
                    overflow: isExpanded ? 'visible' : 'auto',
                    transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    showLineNumbers={true}
                    wrapLines={true}
                    customStyle={{
                        margin: 0,
                        borderRadius: '0 0 8px 8px',
                        padding: '1rem',
                        background: 'var(--code-block-bg)'
                    }}
                    lineNumberStyle={{
                        minWidth: '1.5em',
                        paddingRight: '0.5em',
                        userSelect: 'none',
                        borderRight: '1px solid rgba(234,234,234,0.4)',
                        marginRight: '0.8em'
                    }}
                >
                    {value}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeBlock;