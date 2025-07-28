import React, { useState } from 'react';
import styles from './TagForm.module.scss';
import Button from '../ui/Button/Button';

interface TagFormProps {
  initialValues?: {
    name: string;
    slug: string;
    color: string;
  };
  onSubmit: (values: { name: string; slug: string; color: string }) => void;
  onCancel?: () => void;
}

const TagForm: React.FC<TagFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const [color, setColor] = useState(initialValues?.color || '#a259ff');

  return (
    <form
      className={styles.tagFormCard}
      onSubmit={e => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit({
          name: formData.get('name') as string,
          slug: formData.get('slug') as string,
          color: formData.get('color') as string,
        });
      }}
    >
      <div style={{ width: '100%' }}>
        <label className={styles.formLabel}>标签名称</label>
        <input
          type="text"
          name="name"
          className={styles.formInput}
          defaultValue={initialValues?.name}
          required
        />
      </div>
      <div style={{ width: '100%' }}>
        <label className={styles.formLabel}>标签别名</label>
        <input
          type="text"
          name="slug"
          className={styles.formInput}
          defaultValue={initialValues?.slug}
          required
        />
      </div>
      <div className={styles.colorRow} style={{ width: '100%' }}>
        <label className={styles.formLabel} style={{ marginBottom: 0 }}>标签颜色</label>
        <input
          type="color"
          name="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          className={styles.colorInput}
          required
        />
        <span
          className={styles.colorPreview}
          style={{ background: color }}
        />
      </div>
      <div className={styles.buttonRow}>
        {onCancel && (
          <Button
            type="button"
            className={`${styles.formButton} ${styles.cancel}`}
            onClick={onCancel}
          >
            取消
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          className={styles.formButton}
        >
          确定
        </Button>
      </div>
    </form>
  );
};

export default TagForm; 