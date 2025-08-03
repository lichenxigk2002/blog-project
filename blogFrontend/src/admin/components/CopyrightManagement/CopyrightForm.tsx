import React, { useState } from 'react';
import styles from './CopyrightForm.module.scss';
import Select from '../ui/Select/Select';
import type { SelectOption } from '../ui/Select/Select';

interface CopyrightFormProps {
  initialValues: {
    licenseType: string;
    copyrightHolder: string;
  };
  articleTitle?: string;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const CopyrightForm: React.FC<CopyrightFormProps> = ({
  initialValues,
  articleTitle,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    licenseType: initialValues.licenseType,
    copyrightHolder: initialValues.copyrightHolder
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const licenseOptions: SelectOption[] = [
    { value: 'CC BY-NC-SA 4.0', label: 'CC BY-NC-SA 4.0 (署名-非商业性-相同方式共享)' },
    { value: 'CC BY-NC-ND 4.0', label: 'CC BY-NC-ND 4.0 (署名-非商业性-禁止演绎)' },
    { value: 'CC BY 4.0', label: 'CC BY 4.0 (署名)' },
    { value: 'ALL RIGHTS RESERVED', label: '保留所有权利' },
    { value: 'PUBLIC DOMAIN', label: '公共领域' }
  ];

  return (
    <div className={styles.copyrightFormCard}>
      <form onSubmit={handleSubmit}>
        {articleTitle && (
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>文章标题</label>
            <div className={styles.articleTitleDisplay}>{articleTitle}</div>
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>版权所有者</label>
          <input
            type="text"
            value={formData.copyrightHolder}
            onChange={(e) => setFormData({ ...formData, copyrightHolder: e.target.value })}
            className={styles.formInput}
            placeholder="请输入版权所有者"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>许可协议</label>
          <Select
            value={formData.licenseType}
            options={licenseOptions}
            placeholder="请选择许可协议"
            onChange={(value) => setFormData({ ...formData, licenseType: value as string })}
            width="100%"
            searchable
          />
        </div>

        <div className={styles.buttonRow}>
          <button type="button" onClick={onCancel} className={`${styles.formButton} ${styles.cancel}`}>
            取消
          </button>
          <button type="submit" className={styles.formButton}>
            更新
          </button>
        </div>
      </form>
    </div>
  );
};

export default CopyrightForm; 