import React from 'react';
import styles from './FormInput.module.scss';

export interface FormInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'textarea';
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
  rows?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  title?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
  layout = 'vertical',
  className = '',
  rows = 3,
  maxLength,
  minLength,
  pattern,
  title
}) => {
  const inputProps = {
    name,
    value,
    onChange,
    placeholder,
    required,
    disabled,
    maxLength,
    minLength,
    pattern,
    title,
    className: styles.input
  };

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          {...inputProps}
          rows={rows}
          className={styles.textarea}
        />
      );
    }

    return (
      <input
        {...inputProps}
        type={type}
      />
    );
  };

  return (
    <div className={`${styles.formInput} ${styles[layout]} ${className}`}>
      {layout === 'vertical' && label && (
        <label className={styles.label}>{label}</label>
      )}
      {renderInput()}
    </div>
  );
};

export default FormInput; 