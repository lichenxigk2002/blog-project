import React, { useState, useEffect } from 'react';
import type { FriendLinks } from '@/types/FriendLinks';
import styles from './FriendLinksForm.module.scss';

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
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{initialValues ? '编辑友链' : '添加友链'}</h2>
          <button className={styles.closeButton} onClick={onCancel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

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
            <select
              className={styles.select}
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="pending">待审核</option>
              <option value="approved">已展示</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
              取消
            </button>
            <button type="submit" className={styles.submitButton}>
              {initialValues ? '更新' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FriendLinksForm; 