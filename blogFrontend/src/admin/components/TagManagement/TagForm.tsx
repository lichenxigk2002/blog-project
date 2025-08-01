import React, { useState } from 'react';
import FormInput from '../ui/FormInput/FormInput';
import ColorPicker from '../ui/ColorPicker/ColorPicker';
import FormButtons from '../ui/FormButtons/FormButtons';
import FormItem from '../ui/FormItem/FormItem';

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
  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
    slug: initialValues?.slug || '',
    color: initialValues?.color || '#a259ff'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormItem>
        <FormInput
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="请输入标签名称"
          label="标签名称"
          required
        />
      </FormItem>

      <FormItem>
        <FormInput
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          placeholder="请输入标签别名"
          label="标签别名"
          required
        />
      </FormItem>

      <FormItem>
        <ColorPicker
          value={formData.color}
          onChange={(color) => setFormData(prev => ({ ...prev, color }))}
          label="标签颜色"
          required
        />
      </FormItem>

      <FormButtons
        onCancel={onCancel}
        onSubmit={handleSubmit}
        submitText="确定"
        cancelText="取消"
      />
    </form>
  );
};

export default TagForm; 