import React from 'react';
import styles from './FormButtons.module.scss';
import Button from '../Button/Button';

export interface FormButtonsProps {
  onCancel?: () => void;
  onSubmit?: (e?: React.FormEvent) => void;
  submitText?: string;
  cancelText?: string;
  submitVariant?: 'primary' | 'danger' | 'success';
  cancelVariant?: 'default' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const FormButtons: React.FC<FormButtonsProps> = ({
  onCancel,
  onSubmit,
  submitText = '确定',
  cancelText = '取消',
  submitVariant = 'primary',
  cancelVariant = 'default',
  disabled = false,
  loading = false,
  className = ''
}) => {
  return (
    <div className={`${styles.formButtons} ${className}`}>
      {onCancel && (
        <Button
          type="button"
          variant={cancelVariant}
          onClick={onCancel}
          disabled={disabled}
          className={styles.cancelButton}
        >
          {cancelText}
        </Button>
      )}
      {onSubmit && (
        <Button
          type="submit"
          variant={submitVariant}
          onClick={onSubmit}
          disabled={disabled || loading}
          className={styles.submitButton}
        >
          {loading ? '处理中...' : submitText}
        </Button>
      )}
    </div>
  );
};

export default FormButtons; 