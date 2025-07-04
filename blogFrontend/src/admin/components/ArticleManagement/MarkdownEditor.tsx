import React, { RefObject, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from './ArticleForm.module.scss';
import { FiMaximize2, FiX } from 'react-icons/fi';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, textareaRef }) => {
  const [showFullPreview, setShowFullPreview] = useState(false);

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
            <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
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
              <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
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