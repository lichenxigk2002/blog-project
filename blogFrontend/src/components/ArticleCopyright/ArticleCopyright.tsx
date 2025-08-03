import React, { useState, useEffect } from 'react';
import styles from './ArticleCopyright.module.scss';
import type { Article } from '@/types/Article';
import { CopyrightAPI } from '@/api/CopyrightAPI';
import type { ArticleCopyright } from '@/types/Copyright';

interface ArticleCopyrightProps {
  article: Article;
}

const ArticleCopyright: React.FC<ArticleCopyrightProps> = ({ article }) => {
  const [copyrightInfo, setCopyrightInfo] = useState<ArticleCopyright | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockchainExpanded, setBlockchainExpanded] = useState(false);

  useEffect(() => {
    const fetchCopyrightInfo = async () => {
      try {
        const response = await CopyrightAPI.getArticleCopyright(article.id!);
        if (response && !('error' in response)) {
          setCopyrightInfo(response);
        }
      } catch (error) {
        console.error('获取版权信息失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (article.id) {
      fetchCopyrightInfo();
    }
  }, [article.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  };

  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const getLicenseUrl = (licenseType: string) => {
    switch (licenseType) {
      case 'CC BY-NC-SA 4.0':
        return 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh';
      case 'CC BY-NC-ND 4.0':
        return 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh';
      case 'CC BY-SA 4.0':
        return 'https://creativecommons.org/licenses/by-sa/4.0/deed.zh';
      case 'CC BY 4.0':
        return 'https://creativecommons.org/licenses/by/4.0/deed.zh';
      case 'CC BY-NC 4.0':
        return 'https://creativecommons.org/licenses/by-nc/4.0/deed.zh';
      default:
        return '#';
    }
  };

  const formatHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const getCrossbellUrl = (noteId: string) => {
    return `https://crossbell.io/notes/${noteId}`;
  };

  const getEtherscanUrl = (txHash: string) => {
    return `https://etherscan.io/tx/${txHash}`;
  };

  const toggleBlockchainInfo = () => {
    setBlockchainExpanded(!blockchainExpanded);
  };

  return (
    <div className={styles.copyrightContainer}>
      <div className={styles.copyrightHeader}>
        <span className={styles.copyrightIcon}>©</span>
        <span className={styles.copyrightTitle}>版权声明</span>
      </div>

      <div className={styles.articleInfo}>
        <div className={styles.infoItem}>
          <span className={styles.label}>文章标题：</span>
          <span className={styles.value}>{article.title}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>文章作者：</span>
          <span className={styles.value}>{copyrightInfo?.copyrightHolder || '孤芳不自赏'}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>文章链接：</span>
          <a href={getCurrentUrl()} className={styles.link} target="_blank" rel="noopener noreferrer">
            {getCurrentUrl()}
          </a>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>最后修改时间：</span>
          <span className={styles.value}>
            {formatDate(article.updatedAt || article.createdAt)}
          </span>
        </div>
      </div>

      <div className={styles.copyrightNotice}>
        {copyrightInfo ? (
          <>
            <p className={styles.noticeText}>
              {copyrightInfo.licenseType === 'ALL RIGHTS RESERVED' ? (
                '本文保留所有权利。'
              ) : copyrightInfo.licenseType === 'PUBLIC DOMAIN' ? (
                '本文已进入公共领域。'
              ) : (
                <>
                  本文采用{' '}
                  <a
                    href={getLicenseUrl(copyrightInfo.licenseType)}
                    className={styles.licenseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`查看 ${copyrightInfo.licenseType} 许可协议详情`}
                  >
                    {copyrightInfo.licenseType}
                  </a>
                  {' '}许可协议。
                </>
              )}
            </p>
            <p className={styles.copyrightText}>
              版权所有 © {formatDate(copyrightInfo.createdAt)} {copyrightInfo.copyrightHolder}。
              {copyrightInfo.licenseType === 'PUBLIC DOMAIN' ? (
                '本作品已进入公共领域，任何人都可以自由使用。'
              ) : copyrightInfo.licenseType === 'ALL RIGHTS RESERVED' ? (
                '保留所有权利，未经许可不得使用。'
              ) : copyrightInfo.licenseType.includes('CC BY') ? (
                <>
                  转载请注明来自
                  <a
                    href={getCurrentUrl()}
                    className={styles.licenseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {copyrightInfo.copyrightHolder}
                  </a>
                  ！
                </>
              ) : (
                '请遵守相关许可协议使用。'
              )}
            </p>

            {/* 区块链保护状态 */}
            {copyrightInfo.blockchainTxHash && (
              <div className={styles.blockchainStatus}>
                <div
                  className={styles.blockchainHeader}
                  onClick={toggleBlockchainInfo}
                >
                  <span className={styles.blockchainIcon}>🔗</span>
                  <span className={styles.blockchainTitle}>
                    本文已通过 Crossbell 区块链保护
                  </span>
                  <span className={styles.blockchainBadge}>Crossbell</span>
                  <span className={`${styles.expandIcon} ${blockchainExpanded ? styles.expanded : ''}`}>
                    {blockchainExpanded ? '▼' : '▶'}
                  </span>
                </div>

                {blockchainExpanded && (
                  <div className={styles.blockchainDetails}>
                    <div className={styles.blockchainInfo}>
                      <div className={styles.blockchainItem}>
                        <span className={styles.blockchainLabel}>交易哈希：</span>
                        <a
                          href={getEtherscanUrl(copyrightInfo.blockchainTxHash)}
                          className={styles.blockchainLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="在 Etherscan 上查看交易详情"
                        >
                          {formatHash(copyrightInfo.blockchainTxHash)}
                        </a>
                      </div>
                      {copyrightInfo.noteId && (
                        <div className={styles.blockchainItem}>
                          <span className={styles.blockchainLabel}>Note ID：</span>
                          <a
                            href={getCrossbellUrl(copyrightInfo.noteId)}
                            className={styles.blockchainLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="在 Crossbell 上查看内容"
                          >
                            {copyrightInfo.noteId}
                          </a>
                        </div>
                      )}
                      <div className={styles.blockchainItem}>
                        <span className={styles.blockchainLabel}>保护时间：</span>
                        <span className={styles.blockchainValue}>
                          {formatDate(copyrightInfo.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.blockchainDescription}>
                      本文已通过 Crossbell 区块链进行版权保护，确保内容的不可篡改性和时间戳证明。
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <p className={styles.noticeText}>
              商业转载请联系站长获得授权，非商业转载请注明本文出处及文章链接，未经站长允许不得对文章文字内容进行修改演绎。
            </p>
            <p className={styles.copyrightText}>
              本博客所有文章除特别声明外，均采用
              <a
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.licenseLink}
                title="查看 CC BY-NC-SA 4.0 许可协议详情"
              >
                CC BY-NC-SA 4.0
              </a>
              许可协议。转载请注明来自孤芳不自赏！
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ArticleCopyright; 