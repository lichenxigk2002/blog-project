import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIConfigManager, AIAssistantType } from '@/config/aiConfigManager';
import styles from './AssistantFloatingMenu.module.scss';

interface AssistantFloatingMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAssistant: (assistantType: AIAssistantType) => void;
}

// 助手头像配置
const ASSISTANT_AVATARS = {
  xiaoxi: {
    color: '#FF6B9D',
    avatar: '/AIAvatar/XiaoxiAavtar.jpeg'
  },
  hutao: {
    color: '#FF4500',
    avatar: '/AIAvatar/HuTaoAvatar.avif'
  },
  yoimiya: {
    color: '#FFA500',
    avatar: '/AIAvatar/YoimiyaAvatar.avif'
  }
} as const;

const AssistantFloatingMenu: React.FC<AssistantFloatingMenuProps> = ({
  isOpen,
  onClose,
  onSelectAssistant
}) => {
  const configManager = AIConfigManager.getInstance();
  const assistants = configManager.getAvailableAssistants();

  const handleSelectAssistant = (assistantType: AIAssistantType) => {
    onSelectAssistant(assistantType);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.dropdown}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18 }}
        >
          {assistants.map((assistant) => {
            const avatar = ASSISTANT_AVATARS[assistant.id as keyof typeof ASSISTANT_AVATARS];
            return (
              <div
                key={assistant.id}
                className={styles.assistantOption}
                onClick={() => handleSelectAssistant(assistant.id)}
                style={{
                  '--avatar-color': avatar.color
                } as React.CSSProperties}
              >
                <div className={styles.avatar}>
                  {'avatar' in avatar && (
                    <img
                      src={avatar.avatar}
                      alt={assistant.name}
                      className={styles.avatarImage}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssistantFloatingMenu; 