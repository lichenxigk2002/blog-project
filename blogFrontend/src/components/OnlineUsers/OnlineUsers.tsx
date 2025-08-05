import React, { useEffect, useState } from 'react';
import styles from './OnlineUsers.module.scss';
import { FaUsers } from 'react-icons/fa';

const OnlineUsers: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 创建 WebSocket 连接
    let wsUrl;

    if (process.env.NODE_ENV === 'development') {
      // 开发环境
      wsUrl = 'ws://localhost:8000/ws/online-users';
    } else {
      // 生产环境 - 使用域名通过Nginx代理
      wsUrl = 'wss://www.gfbzsblog.site/ws/online-users';
    }

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'online_users') {
          setOnlineUsers(data.count);
        }
      } catch (error) {
        console.error('解析在线用户消息失败:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    // 组件卸载时关闭连接
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className={styles.onlineUsers}>
      <div className={styles.onlineCount}>
        <FaUsers className={styles.onlineIcon} />
        {onlineUsers}
      </div>
      <div className={styles.onlineLabel}>
        {isConnected ? '在线小伙伴的数量' : '连接中...'}
      </div>
    </div>
  );
};

export default OnlineUsers; 