import React, { useState, useEffect } from 'react';
import type { ThoughtsProps } from '@/types/Thoughts';
import styles from './ThoughtsForm.module.scss';

const moodMap: Record<string, string> = {
  happy: '😄',
  sad: '😢',
  angry: '😠',
  neutral: '😐',
  excited: '🤩',
  tired: '😪',
};

interface ThoughtsFormProps {
  initialValues?: Partial<ThoughtsProps>;
  onSubmit?: (values: ThoughtsProps) => void;
}

const ThoughtsForm: React.FC<ThoughtsFormProps> = ({ initialValues, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<ThoughtsProps>>({
    content: '',
    mood: 'neutral',
    location: '',
    tags: '',
    weather: '',
    device: '',
    ...initialValues
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMoodChange = (mood: string) => {
    setFormData(prev => ({ ...prev, mood }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData as ThoughtsProps);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formItem}>
        <label className={styles.formLabel}>内容</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          className={styles.textarea}
          placeholder="写下你的思考..."
          required
        />
      </div>

      <div className={styles.formItem}>
        <label className={styles.formLabel}>心情</label>
        <div className={styles.moodSelector}>
          {Object.entries(moodMap).map(([key, emoji]) => (
            <button
              key={key}
              type="button"
              className={`${styles.moodButton} ${formData.mood === key ? styles.selected : ''}`}
              onClick={() => handleMoodChange(key)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.formItemRow}>
        <div className={styles.formItem}>
          <label className={styles.formLabel}>位置</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="你在哪里？"
          />
        </div>

        <div className={styles.formItem}>
          <label className={styles.formLabel}>天气</label>
          <input
            type="text"
            name="weather"
            value={formData.weather}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="今天的天气如何？"
          />
        </div>
      </div>

      <div className={styles.formItemRow}>
        <div className={styles.formItem}>
          <label className={styles.formLabel}>标签</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="添加标签，用逗号分隔"
          />
        </div>

        <div className={styles.formItem}>
          <label className={styles.formLabel}>设备</label>
          <input
            type="text"
            name="device"
            value={formData.device}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="使用的设备"
          />
        </div>
      </div>

      <div className={styles.formFooter}>
        <button type="submit" className={styles.submitButton}>
          {initialValues ? '更新' : '创建'}
        </button>
      </div>
    </form>
  );
};

export default ThoughtsForm;
