import React, { useState, useEffect } from 'react';
import styles from './RssSubscribe.module.scss';
import { useTheme } from '@/hooks/useTheme';
import { RssAPI, RssInfo } from '@/api/RssAPI';
import OperationTipModal from '../OperationTipModal/OperationTipModal';
import { FaRss, FaClipboard, FaEye, FaBook, FaLightbulb, FaInfoCircle } from 'react-icons/fa';

interface RssSubscribeProps {
  open: boolean;
  onClose: () => void;
}

const RssSubscribe: React.FC<RssSubscribeProps> = ({ open, onClose }) => {
  const { isDarkMode } = useTheme();
  const [rssInfo, setRssInfo] = useState<RssInfo | null>(null);
  const [tipOpen, setTipOpen] = useState(false);
  const [tipMessage, setTipMessage] = useState('');
  const [tipType, setTipType] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  useEffect(() => {
    if (open) {
      fetchRssInfo();
    }
  }, [open]);

  const fetchRssInfo = async () => {
    try {
      const response = await RssAPI.getRssInfo();
      setRssInfo(response);
    } catch (error: any) {
      console.error('获取RSS信息失败:', error);
      setTipMessage('获取RSS信息失败');
      setTipType('error');
      setTipOpen(true);
    }
  };

  const handleCopyFeedUrl = async () => {
    if (!rssInfo) return;

    try {
      await navigator.clipboard.writeText(rssInfo.feedUrl);
      setTipMessage('RSS Feed链接已复制到剪贴板');
      setTipType('success');
      setTipOpen(true);
    } catch (error) {
      setTipMessage('复制失败，请手动复制');
      setTipType('error');
      setTipOpen(true);
    }
  };

  const handleOpenFeed = () => {
    if (!rssInfo) return;
    window.open(rssInfo.feedUrl, '_blank');
  };

  const handleSubscribeInstructions = () => {
    setTipMessage('请将RSS Feed链接添加到您的RSS阅读器中，如Feedly、Inoreader等');
    setTipType('info');
    setTipOpen(true);
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.rssCard}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          title="关闭"
        >
          ×
        </button>

        <div className={styles.header}>
          <h2><FaRss style={{ marginRight: '0.4em', verticalAlign: '-0.1em' }} />RSS订阅</h2>
          <p className={styles.description}>
            通过RSS订阅，及时获取最新文章更新
          </p>
        </div>

        {rssInfo && (
          <div className={styles.content}>
            <div className={styles.infoSection}>
              <h3><FaInfoCircle style={{ marginRight: '0.4em', verticalAlign: '-0.1em' }} />订阅信息</h3>
              <div className={styles.infoItem}>
                <span className={styles.label}>博客名称：</span>
                <span>{rssInfo.title}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>描述：</span>
                <span>{rssInfo.description}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>语言：</span>
                <span>{rssInfo.language}</span>
              </div>
            </div>

            <div className={styles.feedSection}>
              <h3><FaRss style={{ marginRight: '0.4em', verticalAlign: '-0.1em' }} />RSS Feed链接</h3>
              <div className={styles.feedUrl}>
                <input
                  type="text"
                  value={rssInfo.feedUrl}
                  readOnly
                  className={styles.feedInput}
                />
                <button
                  onClick={handleCopyFeedUrl}
                  className={styles.copyButton}
                  title="复制链接"
                >
                  <FaClipboard />
                </button>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                onClick={handleOpenFeed}
                className={styles.actionButton}
              >
                <FaEye style={{ marginRight: '0.4em', verticalAlign: '-0.1em' }} />预览Feed
              </button>
              <button
                onClick={handleSubscribeInstructions}
                className={styles.actionButton}
              >
                <FaBook style={{ marginRight: '0.4em', verticalAlign: '-0.1em' }} />订阅教程
              </button>
            </div>

            <div className={styles.tips}>
              <h4><FaLightbulb style={{ marginRight: '0.4em', verticalAlign: '-0.1em' }} />使用提示</h4>
              <ul>
                <li>将RSS Feed链接添加到您喜欢的RSS阅读器中</li>
                <li>推荐使用Feedly、Inoreader、NetNewsWire等RSS阅读器</li>
                <li>订阅后可以及时收到新文章通知</li>
                <li>支持离线阅读和个性化设置</li>
              </ul>
            </div>
          </div>
        )}

        {!rssInfo && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>正在加载RSS信息...</p>
          </div>
        )}
      </div>

      <OperationTipModal
        open={tipOpen}
        onClose={() => setTipOpen(false)}
        message={tipMessage}
        type={tipType}
      />
    </div>
  );
};

export default RssSubscribe; 