import React, { useState, useEffect } from 'react';
import type { Gallery } from '@/types/Gallery';
import styles from './GalleryForm.module.scss';

interface GalleryFormProps {
  initialData?: Gallery;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const GalleryForm: React.FC<GalleryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    initialData?.date ? new Date(initialData.date).toISOString().slice(0, 16) : ''
  );

  useEffect(() => {
    // 如果是编辑模式且有初始图片，设置预览URL
    if (initialData?.coverImage) {
      setPreviewUrl(initialData.coverImage);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // 如果没有选择新图片，且存在预览图，说明是编辑模式且没有更改图片
    if (!formData.get('coverImage') && previewUrl) {
      formData.append('coverImage', previewUrl);
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('提交失败:', error);
      // 可以添加错误提示
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
      // 检查文件大小（10MB）
      if (file.size > 10 * 1024 * 1024) {
        alert('图片大小不能超过10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title">标题</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={initialData?.title}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description">描述</label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialData?.description}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="date">时间</label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          value={selectedDate}
          onChange={handleDateChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="category">分类</label>
        <input
          type="text"
          id="category"
          name="category"
          defaultValue={initialData?.category}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="coverImage" className={styles.fileUploadLabel}>
          选择封面图片
        </label>
        <input
          type="file"
          id="coverImage"
          name="coverImage"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.fileInput}
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="预览"
            className={styles.imagePreview}
            onError={(e) => {
              console.error('预览图片加载失败:', previewUrl);
              e.currentTarget.src = '/placeholder.jpg';
            }}
          />
        )}
      </div>
      <div className={styles.modalFooter}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={onCancel}
        >
          取消
        </button>
        <button type="submit" className={styles.primaryButton}>
          {initialData ? '更新' : '创建'}
        </button>
      </div>
    </form>
  );
};

export default GalleryForm; 