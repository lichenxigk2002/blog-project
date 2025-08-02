import React, { useState, useEffect, useRef } from 'react';
import WordCount from '@/components/WordCount/WordCount';
import styles from './ArticleForm.module.scss';
import MarkdownEditor from './MarkdownEditor';
import MarkdownToolbar from './MarkdownToolbar';
import { MarkdownImageAPI } from '@/api/MarkdownImageAPI';
import { SubscribeAPI, Subscriber } from '@/api/SubscribeAPI';
import { ArticlesAPI } from "@/api/ArticlesAPI";
import OperationTipModal from '../ui/OperationTipModal/OperationTipModal';
import { buildArticleData } from '@/utils/articleUtils';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Button from '../ui/Button/Button';
import Select, { SelectOption } from '../ui/Select/Select';
import FormInput from '../ui/FormInput/FormInput';
import Checkbox from '../ui/Checkbox/Checkbox';
import MultiSelect, { MultiSelectOption } from '../ui/MultiSelect/MultiSelect';
import FormItem from '../ui/FormItem/FormItem';

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
  isTop: boolean; // 新增置顶字段
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
    isTop: false,
    ...initialValues
  });

  const [previewContent, setPreviewContent] = useState(initialValues?.content || '');

  const [showToolbar, setShowToolbar] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)
  const lastSaveData = useRef<ArticleFormData | null>(null);
  const autoSaveEnabled = useSelector((state: RootState) => state.settings.contentSettings.autoSaveEnabled)
  const newArticleNotification = useSelector((state: RootState) => state.settings.notificationSettings.newArticleNotification);
  const [autoSaveTip, setAutoSaveTip] = useState<{ open: boolean, message: string, type: 'success' | 'failure' }>({
    open: false,
    message: '',
    type: 'success'
  });

  // 定义状态选项
  const statusOptions: SelectOption[] = [
    { value: 'draft', label: '草稿' },
    { value: 'published', label: '已发布' },
    { value: 'archived', label: '已归档' }
  ];

  // 定义文章类型选项
  const postTypeOptions: SelectOption[] = [
    { value: 'post', label: '文章' },
    { value: 'page', label: '笔记' },
    { value: 'thought', label: '想法' },
    { value: 'diary', label: '日记' }
  ];




  const autoSave = async (data: ArticleFormData) => {
    try {
      const dataForBackend = buildArticleData(data, data.id ? data : undefined);
      if (data.id) {
        await ArticlesAPI.updateArticle(data.id, dataForBackend)
      } else {
        const response = await ArticlesAPI.createArticle(dataForBackend)
        if (response && response.data && response.data.id) {
          setFormData(prev => ({ ...prev, id: response.data.id }))
          lastSaveData.current = { ...dataForBackend, id: response.data.id }
          setAutoSaveTip({ open: true, message: '自动保存成功', type: 'success' });
          return;
        }
      }
      lastSaveData.current = dataForBackend;
      setAutoSaveTip({ open: true, message: '自动保存成功', type: 'success' });
    } catch (e) {
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



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'content') {
      setPreviewContent(value);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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

    if (JSON.stringify(formData) === JSON.stringify(lastSaveData.current)) {
      return;
    }
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      autoSave(formData)
    }, 10000)
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    }
  }, [formData, autoSaveEnabled]);

  // @ts-ignore
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <FormItem>
        <FormInput
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="请输入文章标题"
          label="标题"
          required
        />
      </FormItem>

      <FormItem>
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
      </FormItem>

      <FormItem>
        <FormInput
          type="textarea"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleInputChange}
          placeholder="请输入文章摘要"
          label="摘要"
        />
      </FormItem>
      <div className={styles.formItemRow}>
        <FormItem>
          <FormInput
            type="text"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleInputChange}
            placeholder="请输入封面图片URL"
            label="封面图片"
          />
        </FormItem>

        <FormItem>
          <FormInput
            type="text"
            name="readingTime"
            value={formData.readingTime}
            onChange={handleInputChange}
            placeholder="请输入阅读时间"
            label="阅读时间"
          />
        </FormItem>
      </div>
      <div className={styles.formItemRow}>
        <FormItem>
          <Select
            value={formData.status}
            options={statusOptions}
            onChange={(value) => handleSelectChange('status', value as string)}
            placeholder="请选择状态"
            layout="vertical"
            label="状态"
            width="100%"
          />
        </FormItem>

        <FormItem>
          <Select
            value={formData.postType}
            options={postTypeOptions}
            onChange={(value) => handleSelectChange('postType', value as string)}
            placeholder="请选择文章类型"
            layout="vertical"
            label="文章类型"
            width="100%"
          />
        </FormItem>

        <FormItem>
          <MultiSelect
            options={allTags.map(tag => ({
              id: tag.id,
              label: tag.name,
              value: tag.name
            }))}
            selectedIds={formData.tags}
            onSelectionChange={(ids) => setFormData(prev => ({ ...prev, tags: ids }))}
            label="标签"
            placeholder="请选择标签"
            mode="buttons"
            dropdownPosition="top"
          />
        </FormItem>
      </div>

      {/* 推送选项 */}
      {newArticleNotification ? <><FormItem>
        <div className={styles.formItemRow}>
          <Checkbox
            checked={formData.shouldNotify}
            onChange={(checked) => handleCheckboxChange('shouldNotify', checked)}
            label="推送邮件通知"
          />
          <Checkbox
            checked={formData.isTop}
            onChange={(checked) => handleCheckboxChange('isTop', checked)}
            label="置顶文章"
          />
        </div>
      </FormItem>

        {/* 用户选择 */}
        {formData.shouldNotify && (
          <FormItem>
            <MultiSelect
              options={subscribers.map(subscriber => ({
                id: subscriber.id,
                label: `${subscriber.name} (${subscriber.email})`,
                value: subscriber.email
              }))}
              selectedIds={formData.notifyUserIds}
              onSelectionChange={(ids) => setFormData(prev => ({ ...prev, notifyUserIds: ids }))}
              label="推送用户"
              loading={loadingSubscribers}
              placeholder="推送给所有订阅用户"
              selectAllLabel="推送给所有订阅用户"
              dropdownPosition="top"
            />
          </FormItem>
        )}      </> : <>
        <FormItem>
          <div className={styles.formItemRow}>
            <Checkbox
              checked={false}
              onChange={() => { }}
              label="推送邮件通知已关闭"
              disabled
            />
            <Checkbox
              checked={formData.isTop}
              onChange={(checked) => handleCheckboxChange('isTop', checked)}
              label="置顶文章"
            />
          </div>
        </FormItem>
      </>}


      <FormItem>
        <Button type="submit" variant="primary" className={styles.submitButton}>
          保存
        </Button>
      </FormItem>
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