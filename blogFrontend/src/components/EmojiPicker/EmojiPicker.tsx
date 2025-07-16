import React, { useRef, useEffect, useState } from 'react';
import styles from './EmojiPicker.module.scss';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose }) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [Picker, setPicker] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  // 动态加载 emoji-mart 组件和数据
  useEffect(() => {
    let mounted = true;
    Promise.all([
      import('@emoji-mart/react').then(mod => mod.default),
      import('@emoji-mart/data').then(mod => mod.default),
    ]).then(([PickerComp, emojiData]) => {
      if (mounted) {
        setPicker(() => PickerComp);
        setData(emojiData);
      }
    });
    return () => { mounted = false; };
  }, []);

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

  if (!Picker || !data) return null; // 或者可以显示 loading

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