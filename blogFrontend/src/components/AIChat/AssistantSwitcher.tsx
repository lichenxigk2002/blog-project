import React, { useState, useEffect } from 'react';
import { AIConfigManager, AIAssistantType } from '@/config/aiConfigManager';
import styles from './AssistantSwitcher.module.scss';

interface AssistantSwitcherProps {
  onSwitch?: (assistantType: AIAssistantType) => void;
}

const AssistantSwitcher: React.FC<AssistantSwitcherProps> = ({ onSwitch }) => {
  const [currentAssistant, setCurrentAssistant] = useState<AIAssistantType>('xiaoxi');
  const configManager = AIConfigManager.getInstance();

  useEffect(() => {
    setCurrentAssistant(configManager.getCurrentAssistant());
  }, []);

  const handleSwitch = (type: AIAssistantType) => {
    configManager.switchAssistant(type);
    setCurrentAssistant(type);
    onSwitch?.(type);
  };

  const assistants = configManager.getAvailableAssistants();

  return (
    <div className={styles.switcherContainer}>
      <span className={styles.label}>AI助手：</span>
      <div className={styles.buttonGroup}>
        {assistants.map((assistant) => (
          <button
            key={assistant.id}
            className={`${styles.switchButton} ${currentAssistant === assistant.id ? styles.active : ''
              }`}
            onClick={() => handleSwitch(assistant.id)}
            title={assistant.description}
          >
            {assistant.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssistantSwitcher; 