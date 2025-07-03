import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import WordCount from '@/components/WordCount/WordCount';
import styles from './ArticleForm.module.scss';

interface Tag {
  id: number;
  name: string;
}

interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  readingTime: number;
  status: 'draft' | 'published' | 'archived';
  postType: 'post' | 'page' | 'thought' | 'diary';
  tags: number[];
}

interface ArticleFormProps {
  allTags: Tag[];
  initialValues?: Partial<ArticleFormData>;
  onSubmit?: (values: ArticleFormData) => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ allTags, initialValues, onSubmit }) => {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    readingTime: 0,
    status: 'draft',
    postType: 'post',
    tags: [],
    ...initialValues
  });

  const [previewContent, setPreviewContent] = useState(initialValues?.content || '');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPostTypeOpen, setIsPostTypeOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const postTypeRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({ ...prev, ...initialValues }));
      if (initialValues.content) {
        setPreviewContent(initialValues.content);
      }
    }
  }, [initialValues]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
      if (postTypeRef.current && !postTypeRef.current.contains(event.target as Node)) {
        setIsPostTypeOpen(false);
      }
      if (tagsRef.current && !tagsRef.current.contains(event.target as Node)) {
        setIsTagsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'content') {
      setPreviewContent(value);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'status') setIsStatusOpen(false);
    if (name === 'postType') setIsPostTypeOpen(false);
  };

  const handleTagsChange = (tagId: number) => {
    setFormData(prev => {
      const newTags = prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId];
      return { ...prev, tags: newTags };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formItem}>
        <label className={styles.formLabel}>标题</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={styles.input}
          placeholder="请输入文章标题"
          required
        />
      </div>

      <div className={styles.formItem}>
        <div className={styles.labelContainer}>
          <label className={styles.formLabel}>内容</label>
          <WordCount text={formData.content} />
        </div>
        <div className={styles.row}>
          <div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className={`${styles.editor} ${styles.textarea}`}
              placeholder="支持 Markdown 格式和 HTML 标签"
              required
            />
          </div>
          <div className={styles.preview}>
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
            >
              {previewContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div className={styles.formItem}>
        <label className={styles.formLabel}>摘要</label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleInputChange}
          className={styles.textarea}
          placeholder="请输入文章摘要"
        />
      </div>
      <div className={styles.formItemRow}>
        <div className={styles.formItem}>
          <label className={styles.formLabel}>封面图片</label>
          <input
            type="text"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="请输入封面图片URL"
          />
        </div>

        <div className={styles.formItem}>
          <label className={styles.formLabel}>阅读时间</label>
          <input
            type="text"
            name="readingTime"
            value={formData.readingTime}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="请输入阅读时间"
          />
        </div>
      </div>
      <div className={styles.formItemRow}>
        <div className={styles.formItem} ref={statusRef}>
          <label className={styles.formLabel}>状态</label>
          <div className={styles.select}>
            <div
              className={styles.selectSelector}
              onClick={() => setIsStatusOpen(!isStatusOpen)}
            >
              {formData.status === 'draft' ? '草稿' : formData.status === 'published' ? '已发布' : '已归档'}
            </div>
            {isStatusOpen && (
              <div className={styles.selectDropdown}>
                <div
                  className={`${styles.selectOption} ${formData.status === 'draft' ? styles.selected : ''}`}
                  onClick={() => handleSelectChange('status', 'draft')}
                >
                  草稿
                </div>
                <div
                  className={`${styles.selectOption} ${formData.status === 'published' ? styles.selected : ''}`}
                  onClick={() => handleSelectChange('status', 'published')}
                >
                  已发布
                </div>
                <div
                  className={`${styles.selectOption} ${formData.status === 'published' ? styles.selected : ''}`}
                  onClick={() => handleSelectChange('status', 'archived')}
                >
                  已归档
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formItem} ref={postTypeRef}>
          <label className={styles.formLabel}>文章类型</label>
          <div className={styles.select}>
            <div
              className={styles.selectSelector}
              onClick={() => setIsPostTypeOpen(!isPostTypeOpen)}
            >
              {formData.postType === 'post' ? '文章' : formData.postType === 'page' ? '笔记' : formData.postType === 'thought' ? '思考' : '日记'}
            </div>
            {isPostTypeOpen && (
              <div className={styles.selectDropdown}>
                <div
                  className={`${styles.selectOption} ${formData.postType === 'post' ? styles.selected : ''}`}
                  onClick={() => handleSelectChange('postType', 'post')}
                >
                  文章
                </div>
                <div
                  className={`${styles.selectOption} ${formData.postType === 'page' ? styles.selected : ''}`}
                  onClick={() => handleSelectChange('postType', 'page')}
                >
                  笔记
                </div>
                <div
                  className={`${styles.selectOption} ${formData.postType === 'thought' ? styles.selected : ''}`}
                  onClick={() => handleSelectChange('postType', 'thought')}
                >
                  想法
                </div>
                <div
                  className={`${styles.selectOption} ${formData.postType === 'diary' ? styles.selected : ''}`}
                  onClick={() => handleSelectChange('postType', 'diary')}
                >
                  日记
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formItem} ref={tagsRef}>
          <label className={styles.formLabel}>标签</label>
          <div className={styles.select}>
            <div
              className={styles.selectSelector}
              onClick={() => setIsTagsOpen(!isTagsOpen)}
            >
              {formData.tags.length > 0
                ? formData.tags.map(id => allTags.find(tag => tag.id === id)?.name).join(', ')
                : '请选择标签'}
            </div>
            {isTagsOpen && (
              <div className={styles.tagButtonGroup}>
                {allTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    className={`${styles.tagButton} ${formData.tags.includes(tag.id) ? styles.selected : ''}`}
                    onClick={() => handleTagsChange(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.formItem}>
        <button type="submit" className={styles.submitButton}>
          保存
        </button>
      </div>
    </form>
  );
};

export default ArticleForm; 