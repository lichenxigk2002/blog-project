import React, { useRef, useEffect } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import styles from './EmojiPicker.module.scss';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose }) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.emojiPickerContainer} ref={pickerRef}>
      <Picker
        data={data}
        theme="light"
        onEmojiSelect={(emoji: any) => onSelect(emoji.native)}
        previewPosition="none"
        skinTonePosition="search"
        style={{ width: 350, height: 400 }}
      />
    </div>
  );
};

export default EmojiPicker; 