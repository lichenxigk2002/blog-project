import React, { useState, useEffect } from 'react';
import type { FriendLinks } from '@/types/FriendLinks';
import styles from './FriendLinksForm.module.scss';
import Select from '../ui/Select/Select';
import Button from '../ui/Button/Button';

interface FriendLinksFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: FriendLinks | null;
}

const FriendLinksForm: React.FC<FriendLinksFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues
}) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    avatarUrl: '',
    description: '',
    status: 'pending' as 'approved' | 'pending'
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || '',
        url: initialValues.url || '',
        avatarUrl: initialValues.avatarUrl || '',
        description: initialValues.description || '',
        status: initialValues.status || 'pending'
      });
    } else {
      setFormData({
        name: '',
        url: '',
        avatarUrl: '',
        description: '',
        status: 'pending'
      });
    }
  }, [initialValues, visible]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.url.trim()) {
      alert('请填写必填字段');
      return;
    }
    onSubmit(formData);
  };

  if (!visible) return null;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          网站名称 <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.input}
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="请输入网站名称"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          网站地址 <span className={styles.required}>*</span>
        </label>
        <input
          type="url"
          className={styles.input}
          value={formData.url}
          onChange={(e) => handleInputChange('url', e.target.value)}
          placeholder="https://example.com"
          required
        />
      </div>

      <div className={styles.avatarSection}>
        <div className={styles.formGroup}>
          <label className={styles.label}>头像地址</label>
          <input
            type="url"
            className={styles.input}
            value={formData.avatarUrl}
            onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
            placeholder="https://example.com/avatar.png"
          />
        </div>
        {formData.avatarUrl && (
          <div className={styles.avatarPreview}>
            <img
              src={formData.avatarUrl}
              alt="头像预览"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/default-avatar.png';
              }}
            />
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>网站描述</label>
        <textarea
          className={styles.textarea}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="请输入网站描述"
          rows={3}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>展示状态</label>
        <Select
          value={formData.status}
          onChange={(value) => handleInputChange('status', value as string)}
          options={[
            { value: 'pending', label: '待审核' },
            { value: 'approved', label: '已展示' }
          ]}
          placeholder="选择展示状态"
        />
      </div>

      <div className={styles.formActions}>
        <Button type="button" variant="default" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" variant="primary">
          {initialValues ? '更新' : '创建'}
        </Button>
      </div>
    </form>
  );
};

export default FriendLinksForm; 