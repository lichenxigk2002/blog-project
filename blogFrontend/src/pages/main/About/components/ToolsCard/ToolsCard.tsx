import React, { useState } from 'react';
import styles from './ToolsCard.module.scss';

interface Tool {
  id: number;
  name: string;
  icon: string;
  url: string;
  description: string;
}

const ToolsCard: React.FC = () => {
  const [hoveredTool, setHoveredTool] = useState<number | null>(null);

  const tools: Tool[] = [
    {
      id: 1,
      name: "VS Code",
      icon: "/tools/Vscode.png",
      url: "https://code.visualstudio.com/",
      description: "代码编辑器"
    },
    {
      id: 2,
      name: "JetBrains",
      icon: "/tools/JetBrains.png",
      url: "https://www.jetbrains.com/",
      description: "开发工具套件"
    },
    {
      id: 3,
      name: "Apifox",
      icon: "/tools/apifox.png",
      url: "https://www.apifox.cn/",
      description: "API 开发工具"
    },
    {
      id: 4,
      name: "Wireshark",
      icon: "/tools/wireshark.png",
      url: "https://www.wireshark.org/",
      description: "网络分析工具"
    }
  ];

  const handleToolClick = (tool: Tool) => {
    window.open(tool.url, '_blank');
  };

  return (
    <div className={styles.toolsCardContainer}>
      <h1>常用工具</h1>

      <div className={styles.toolsGrid}>
        {tools.map((tool) => (
          <div
            key={tool.id}
            className={styles.toolItem}
            onClick={() => handleToolClick(tool)}
            onMouseEnter={() => setHoveredTool(tool.id)}
            onMouseLeave={() => setHoveredTool(null)}
            title={tool.description}
          >
            <div className={styles.toolIcon}>
              <img src={tool.icon} alt={tool.name} />
            </div>
            <div className={styles.toolName}>{tool.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsCard; 