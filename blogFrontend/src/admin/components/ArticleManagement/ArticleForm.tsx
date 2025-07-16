import React, { useState, useEffect, useRef } from 'react';
import WordCount from '@/components/WordCount/WordCount';
import styles from './ArticleForm.module.scss';
import MarkdownEditor from './MarkdownEditor';
import MarkdownToolbar from './MarkdownToolbar';
import { MarkdownImageAPI } from '@/api/MarkdownImageAPI';
import { SubscribeAPI, Subscriber } from '@/api/SubscribeAPI';
import {ArticlesAPI} from "@/api/ArticlesAPI";
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import { buildArticleData } from '@/utils/articleUtils';
import { useSelector} from "react-redux";
import {RootState} from "@/redux/store";

interface Tag {
  id: number;
  name: string;
}

interface ArticleFormData {
  id?: number; // 这里加上
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  readingTime: number;
  status: 'draft' | 'published' | 'archived';
  postType: 'post' | 'page' | 'thought' | 'diary';
  tags: number[];
  shouldNotify: boolean;
  notifyUserIds: number[];
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
    shouldNotify: false,
    notifyUserIds: [],
    ...initialValues
  });

  const [previewContent, setPreviewContent] = useState(initialValues?.content || '');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPostTypeOpen, setIsPostTypeOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const postTypeRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const usersRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)
  const lastSaveData = useRef<ArticleFormData | null>(null);
  const autoSaveEnabled = useSelector((state:RootState) =>state.settings.contentSettings.autoSaveEnabled)
  const newArticleNotification = useSelector((state:RootState) => state.settings.notificationSettings.newArticleNotification);
  const [autoSaveTip, setAutoSaveTip] = useState<{ open: boolean, message: string, type: 'success' | 'failure' }>({
    open: false,
    message: '',
    type: 'success'
  });




  const autoSave = async (data: ArticleFormData) => {
    try{
      const dataForBackend = buildArticleData(data, data.id ? data : undefined);
      if(data.id){
        await ArticlesAPI.updateArticle(data.id, dataForBackend)
      }else{
        const response = await ArticlesAPI.createArticle(dataForBackend)
        if(response && response.data && response.data.id){
          setFormData(prev => ({...prev, id: response.data.id}))
          lastSaveData.current = {...dataForBackend, id: response.data.id}
          setAutoSaveTip({ open: true, message: '自动保存成功', type: 'success' });
          return;
        }
      }
      lastSaveData.current = dataForBackend;
      setAutoSaveTip({ open: true, message: '自动保存成功', type: 'success' });
    }catch (e){
      setAutoSaveTip({ open: true, message: '自动保存失败', type: 'failure' });
    }
  }

  useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({ ...prev, ...initialValues }));
      if (initialValues.content) {
        setPreviewContent(initialValues.content);
      }
    }
  }, [initialValues]);

  useEffect(() => {
    // 获取订阅用户列表
    const fetchSubscribers = async () => {
      setLoadingSubscribers(true);
      try {
        const response = await SubscribeAPI.getSubscribers();
        if (response.success && response.data) {
          setSubscribers(response.data);
        }
      } catch (error) {
        console.error('获取订阅用户失败:', error);
      } finally {
        setLoadingSubscribers(false);
      }
    };

    fetchSubscribers();
  }, []);

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
      if (usersRef.current && !usersRef.current.contains(event.target as Node)) {
        setIsUsersOpen(false);
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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const insertAtCursor = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = formData.content.slice(0, start) + before + formData.content.slice(start, end) + after + formData.content.slice(end);
    setFormData(prev => ({ ...prev, content: newValue }));
    setPreviewContent(newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + before.length;
    }, 0);
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    // 使用 Promise 包装文件选择
    const filePromise = new Promise<File | null>((resolve) => {
      input.onchange = () => {
        if (input.files && input.files.length > 0) {
          resolve(input.files[0]);
        } else {
          resolve(null);
        }
      };
    });

    input.click();

    try {
      const file = await filePromise;
      if (!file) return; // 用户取消了选择

      console.log('开始上传图片:', file.name);
      const res = await MarkdownImageAPI.uploadImage(file);
      console.log('上传响应:', res);

      if (res && res.url) {
        // 插入带尺寸的图片，用户可以根据需要调整
        insertAtCursor(`<img src="${res.url}" alt="图片" width="500" height="300" />`);
        console.log('图片插入成功:', res.url);
      } else {
        console.error('上传响应格式错误:', res);
        alert('图片上传失败: 响应格式错误');
      }
    } catch (e) {
      console.error('图片上传错误:', e);
      alert(`图片上传失败: ${e instanceof Error ? e.message : '未知错误'}`);
    } finally {
      // 清理 input 元素
      input.remove();
    }
  };

  useEffect(() => {
    if (!autoSaveEnabled) return;

    if(JSON.stringify(formData) === JSON.stringify(lastSaveData.current)){
      return;
    }
    if(saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      autoSave(formData)
    },10000)
    return () => {
      if(saveTimeout.current) clearTimeout(saveTimeout.current);
    }
  }, [formData, autoSaveEnabled]);

  // @ts-ignore
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
        <div className={styles.labelContainer} style={{ position: 'relative' }}>
          <label className={styles.formLabel}>内容</label>
          <WordCount text={formData.content} />
          <MarkdownToolbar
            showToolbar={showToolbar}
            setShowToolbar={setShowToolbar}
            insertAtCursor={insertAtCursor}
            handleImageUpload={handleImageUpload}
          />
        </div>
        <MarkdownEditor
          value={formData.content}
          onChange={val => {
            setFormData(prev => ({ ...prev, content: val }));
            setPreviewContent(val);
          }}
          textareaRef={textareaRef}
        />
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
                    onClick={() => {
                      const newTags = formData.tags.includes(tag.id)
                        ? formData.tags.filter(id => id !== tag.id)
                        : [...formData.tags, tag.id];
                      setFormData(prev => ({ ...prev, tags: newTags }));
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 推送选项 */}
      {newArticleNotification ? <><div className={styles.formItem}>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
                type="checkbox"
                checked={formData.shouldNotify}
                onChange={(e) => handleCheckboxChange('shouldNotify', e.target.checked)}
                className={styles.checkbox}
            />
            <span>推送邮件通知</span>
          </label>
        </div>
      </div>

        {/* 用户选择 */}
        {formData.shouldNotify && (
            <div className={styles.formItem} ref={usersRef}>
              <label className={styles.formLabel}>推送用户</label>
              <div className={styles.select}>
                <div
                    className={styles.selectSelector}
                    onClick={() => setIsUsersOpen(!isUsersOpen)}
                >
                  {formData.notifyUserIds.length > 0
                      ? `已选择 ${formData.notifyUserIds.length} 个用户`
                      : '推送给所有订阅用户'}
                </div>
                {isUsersOpen && (
                    <div className={styles.userDropdown}>
                      {loadingSubscribers ? (
                          <div className={styles.loadingText}>加载中...</div>
                      ) : (
                          <>
                            <div className={styles.userOption}>
                              <label className={styles.userCheckbox}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={formData.notifyUserIds.length === 0}
                                    onChange={() => setFormData(prev => ({ ...prev, notifyUserIds: [] }))}
                                />
                                <span>推送给所有订阅用户</span>
                              </label>
                            </div>
                            <div className={styles.userDivider}></div>
                            {subscribers.map(subscriber => (
                                <div key={subscriber.id} className={styles.userOption}>
                                  <label className={styles.userCheckbox}>
                                    <input
                                        className={styles.checkbox}
                                        type="checkbox"
                                        checked={formData.notifyUserIds.includes(subscriber.id)}
                                        onChange={(e) => {
                                          const newUserIds = e.target.checked
                                              ? [...formData.notifyUserIds, subscriber.id]
                                              : formData.notifyUserIds.filter(id => id !== subscriber.id);
                                          setFormData(prev => ({ ...prev, notifyUserIds: newUserIds }));
                                        }}
                                    />
                                    <span>{subscriber.name} ({subscriber.email})</span>
                                  </label>
                                </div>
                            ))}
                          </>
                      )}
                    </div>
                )}
              </div>
            </div>
        )}</> : <>
        <div className={styles.formItem}>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>

              <span>推送邮件通知已关闭</span>
            </label>
          </div>
        </div>
      </>}


      <div className={styles.formItem}>
        <button type="submit" className={styles.submitButton}>
          保存
        </button>
      </div>
      <OperationTipModal
          open={autoSaveTip.open}
          onClose={() => setAutoSaveTip(prev => ({ ...prev, open: false }))}
          message={autoSaveTip.message}
          type={autoSaveTip.type}
      />
    </form>
  );
};

export default ArticleForm; 