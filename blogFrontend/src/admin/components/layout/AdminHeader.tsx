'use client';

import React, { useState, useEffect } from 'react';
import { MenuIcon, MenuCollapsedIcon, LogoutIcon } from '@/admin/components/ui/Icons/SidebarIcons';
import { fetchRandomPoetry, PoetryData } from '@/api/PoetryAPI';
import styles from './AdminHeader.module.scss';

interface AdminHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, onToggleCollapse }) => {
  const [poetry, setPoetry] = useState<PoetryData | null>(null);
  const [loading, setLoading] = useState(false);

  // 在AdminHeader.tsx中添加静态诗词数组
  const staticPoems = [
    { content: '山重水复疑无路，柳暗花明又一村。', author: '陆游《游山西村》' },
    { content: '梅须逊雪三分白，雪却输梅一段香。', author: '卢梅坡《雪梅》' },
    { content: '海内存知己，天涯若比邻。', author: '王勃《送杜少府之任蜀州》' },
    { content: '落红不是无情物，化作春泥更护花。', author: '龚自珍《己亥杂诗》' },
    { content: '长风破浪会有时，直挂云帆济沧海。', author: '李白《行路难》' },
    { content: '会当凌绝顶，一览众山小。', author: '杜甫《望岳》' },
    { content: '天生我材必有用，千金散尽还复来。', author: '李白《将进酒》' },
    { content: '沉舟侧畔千帆过，病树前头万木春。', author: '刘禹锡《酬乐天扬州初逢席上见赠》' },
    { content: '不畏浮云遮望眼，自缘身在最高层。', author: '王安石《登飞来峰》' },
    { content: '纸上得来终觉浅，绝知此事要躬行。', author: '陆游《冬夜读书示子聿》' },
    { content: '问渠那得清如许，为有源头活水来。', author: '朱熹《观书有感》' },
    { content: '春蚕到死丝方尽，蜡炬成灰泪始干。', author: '李商隐《无题》' },
  ];

  // 修改loadPoetry函数
  const loadPoetry = async () => {
    setLoading(true);
    try {
      // 模拟网络延迟，让体验更真实
      await new Promise(resolve => setTimeout(resolve, 300));

      // 随机选择一首诗词
      const randomPoem = staticPoems[Math.floor(Math.random() * staticPoems.length)];
      setPoetry(randomPoem);
    } catch (error) {
      console.error('获取诗词失败:', error);
      setPoetry(staticPoems[0]);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取诗词
  useEffect(() => {
    loadPoetry();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.toggleBtn}
          onClick={onToggleCollapse}
          title={collapsed ? "展开菜单" : "收起菜单"}
        >
          {collapsed ? <MenuIcon /> : <MenuCollapsedIcon />}
        </button>
      </div>

      {/* 诗词显示区域 */}
      <div className={styles.center}>
        {poetry && (
          <div className={styles.poetryContainer}>
            <div className={styles.poetryContent}>{poetry.content}</div>
            <div className={styles.poetryAuthor}>—— {poetry.author}</div>
            <button
              className={styles.refreshBtn}
              onClick={loadPoetry}
              disabled={loading}
              title="换一句"
            >
              {loading ? '...' : ''}
            </button>
          </div>
        )}
      </div>

      <div className={styles.right}>
        <div className={styles.userInfo}>
          <img
            src="/images/avatar_20250520_215057_01.png"
            alt="管理员头像"
            className={styles.avatar}
          />
          <span className={styles.username}>孤芳不自赏</span>
        </div>

        <button
          className={styles.logoutBtn}
          onClick={() => window.location.href = '/main/Home'}
        >
          <LogoutIcon />
          <span>退出</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader; 