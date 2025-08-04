import React, { useState } from 'react';
import styles from './CopyrightForm.module.scss';
import Select from '../ui/Select/Select';
import type { SelectOption } from '../ui/Select/Select';
import FormItem from '../ui/FormItem/FormItem';
import FormInput from '../ui/FormInput/FormInput';
import Button from '../ui/Button/Button';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const licenseOptions: SelectOption[] = [
    { value: 'CC BY-NC-SA 4.0', label: 'CC BY-NC-SA 4.0 (署名-非商业性-相同方式共享)' },
    { value: 'CC BY-NC-ND 4.0', label: 'CC BY-NC-ND 4.0 (署名-非商业性-禁止演绎)' },
    { value: 'CC BY 4.0', label: 'CC BY 4.0 (署名)' },
    { value: 'ALL RIGHTS RESERVED', label: '保留所有权利' },
    { value: 'PUBLIC DOMAIN', label: '公共领域' }
  ];

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {articleTitle && (
        <FormItem>
          <FormInput
            type="text"
            name="articleTitle"
            value={articleTitle}
            onChange={() => { }}
            placeholder=""
            label="文章标题"
            disabled
          />
        </FormItem>
      )}

      <FormItem>
        <FormInput
          type="text"
          name="copyrightHolder"
          value={formData.copyrightHolder}
          onChange={handleInputChange}
          placeholder="请输入版权所有者"
          label="版权所有者"
          required
        />
      </FormItem>

      <FormItem>
        <Select
          value={formData.licenseType}
          options={licenseOptions}
          placeholder="请选择许可协议"
          onChange={(value) => handleSelectChange('licenseType', value as string)}
          layout="vertical"
          label="许可协议"
          width="100%"
          searchable
        />
      </FormItem>

      <FormItem>
        <div className={styles.buttonRow}>
          <Button type="button" variant="default" onClick={onCancel} className={styles.cancelButton}>
            取消
          </Button>
          <Button type="submit" variant="primary" className={styles.submitButton}>
            更新
          </Button>
        </div>
      </FormItem>
    </form>
  );
};

export default CopyrightForm; 