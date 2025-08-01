import React, { useState } from 'react';
import styles from './ColorPicker.module.scss';

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  required = false,
  disabled = false,
  className = ''
}) => {
  const [color, setColor] = useState(value);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <div className={`${styles.colorPicker} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.colorRow}>
        <input
          type="color"
          value={color}
          onChange={(e) => handleColorChange(e.target.value)}
          className={styles.colorInput}
          disabled={disabled}
          required={required}
        />
        <span
          className={styles.colorPreview}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default ColorPicker; 