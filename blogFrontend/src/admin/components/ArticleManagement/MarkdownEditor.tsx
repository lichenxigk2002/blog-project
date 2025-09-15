import React, { RefObject, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import dynamic from 'next/dynamic';
import styles from './ArticleForm.module.scss';
import { FiMaximize2, FiX } from 'react-icons/fi';

// 动态导入自定义组件
const SequenceDiagram = dynamic(() => import('@/components/ArticleUI/SequenceDiagram/SequenceDiagram'), { ssr: false });
const MermaidDiagram = dynamic(() => import('@/components/ArticleUI/MermaidDiagram/MermaidDiagram'), { ssr: false });
const CodeBlock = dynamic(() => import('@/components/ArticleUI/Code/CodeBlock'), { ssr: false });
const MetaCard = dynamic(() => import('@/components/ArticleUI/MetaCard/MetaCard'), { ssr: false });
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ArticleUI/Table/Table';
const StrikethroughText = dynamic(() => import('@/components/ArticleUI/StrikethroughText/StrikethroughText'), { ssr: false });
const ArticleVideo = dynamic(() => import('@/components/ArticleUI/ArticleVideo/ArticleVideo'), { ssr: false });
const ArticleImage = dynamic(() => import('@/components/ArticleUI/ArticleImage/ArticleImage'), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, textareaRef }) => {
  const [showFullPreview, setShowFullPreview] = useState(false);

  // 使用和文章详情页相同的组件配置
  const markdownComponents = {
    // 自定义标题渲染，添加锚点ID和样式
    h1: ({ node, ...props }: any) => (
      <h1
        id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
        className="heading"
        {...props}
      />
    ),
    h2: ({ node, ...props }: any) => (
      <h2
        id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
        className="heading"
        {...props}
      />
    ),
    h3: ({ node, ...props }: any) => (
      <h3
        id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
        className="heading"
        {...props}
      />
    ),
    h4: ({ node, ...props }: any) => (
      <h4
        id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
        className="heading"
        {...props}
      />
    ),
    h5: ({ node, ...props }: any) => (
      <h5
        id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
        className="heading"
        {...props}
      />
    ),
    h6: ({ node, ...props }: any) => (
      <h6
        id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
        className="heading"
        {...props}
      />
    ),
    // 段落样式
    p: (() => {
      let paragraphIndex = 0;
      return ({ node, ...props }: any) => (
        <p
          id={`para-${paragraphIndex++}`}
          className="article-content-text-size"
          {...props}
        />
      );
    })(),
    // 列表样式
    ul: ({ node, ...props }: any) => (
      <ul className="list" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list" {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <li className="article-content-text-size" {...props} />
    ),
    // 引用样式
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="article-content-text-size" {...props} />
    ),
    // 代码块处理
    code: ({ node, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : 'text';

      // 处理序列图
      if (language === 'sequence') {
        return (
          <SequenceDiagram diagram={String(children).replace(/\n$/, '')} />
        );
      }

      if (language === 'mermaid') {
        return <MermaidDiagram diagram={String(children).replace(/\n$/, '')} />;
      }

      if (language === 'meta') {
        // 解析 key:value 格式
        const lines = String(children).split('\n');
        const meta: any = {};
        lines.forEach(line => {
          const [key, ...rest] = line.split(':');
          if (key && rest.length) {
            meta[key.trim()] = rest.join(':').trim();
          }
        });
        // tags 特殊处理
        if (meta.tags) {
          meta.tags = meta.tags.split(',').map((t: string) => t.trim());
        }
        if (meta.views) {
          meta.views = Number(meta.views);
        }
        return <MetaCard {...meta} />;
      }

      // 行内代码
      if (!match) {
        return (
          <code className="inline-code" {...props}>
            {children}
          </code>
        );
      }

      // 代码块
      return (
        <CodeBlock
          language={language}
          value={String(children).replace(/\n$/, '')}
        />
      );
    },
    // 预格式化标签样式
    pre: ({ node, ...props }: any) => <pre className="pre" {...props} />,
    // 添加表格相关组件
    table: ({ node, ...props }: any) => <Table {...props} />,
    thead: ({ node, ...props }: any) => <Thead {...props} />,
    tbody: ({ node, ...props }: any) => <Tbody {...props} />,
    tr: ({ node, ...props }: any) => <Tr {...props} />,
    th: ({ node, ...props }: any) => <Th {...props} />,
    td: ({ node, ...props }: any) => <Td {...props} />,
    // 当 Markdown 是：~~删除的文字~~
    del: ({ node, children, ...props }: any) => (
      <StrikethroughText {...props}>
        {children}
      </StrikethroughText>
    ),
    // 添加视频组件
    video: ({ node, ...props }: any) => <ArticleVideo {...props} />,
    img: ({ node, ...props }: any) => <ArticleImage {...props} />,
  };

  return (
    <>
      <div className={styles.row}>
        <div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`${styles.editor} ${styles.textarea}`}
            placeholder="支持 Markdown 格式和 HTML 标签"
          />
        </div>
        <div className={styles.previewContainer}>
          <div className={styles.previewHeader}>
            <span>预览</span>
            <button
              type="button"
              className={styles.previewExpandButton}
              onClick={() => setShowFullPreview(true)}
              title="全屏预览"
            >
              <FiMaximize2 size={16} />
            </button>
          </div>
          <div className={styles.preview}>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {value}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 全屏预览模态框 */}
      {showFullPreview && (
        <div className={styles.fullPreviewOverlay} onClick={() => setShowFullPreview(false)}>
          <div className={styles.fullPreviewModal} onClick={e => e.stopPropagation()}>
            <div className={styles.fullPreviewHeader}>
              <h3>文章预览</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowFullPreview(false)}
                title="关闭预览"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className={styles.fullPreviewContent}>
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {value}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarkdownEditor; 