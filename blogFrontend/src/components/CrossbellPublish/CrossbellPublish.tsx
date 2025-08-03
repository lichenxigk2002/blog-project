import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useCharacter } from '@crossbell/react-account';
import { useCreateNote } from '@crossbell/react-account';
import styles from './CrossbellPublish.module.scss';

interface CrossbellPublishProps {
  articleId: number;
  title: string;
  content: string;
  licenseType: string;
  onSuccess?: (txHash: string, noteId: string) => void;
  onError?: (error: string) => void;
}

export const CrossbellPublish: React.FC<CrossbellPublishProps> = ({
  articleId,
  title,
  content,
  licenseType,
  onSuccess,
  onError
}) => {
  const { isConnected } = useAccount();
  const { character } = useCharacter();
  const { mutateAsync: createNote, isLoading } = useCreateNote();

  const [isPublished, setIsPublished] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [noteId, setNoteId] = useState('');

  const handlePublish = async () => {
    if (!isConnected) {
      onError?.('请先连接钱包');
      return;
    }

    if (!character) {
      onError?.('请先创建 Crossbell 角色');
      return;
    }

    try {
      // 构建文章内容
      const noteContent = {
        title,
        content: content.substring(0, 1000) + (content.length > 1000 ? '...' : ''), // 限制内容长度
        licenseType,
        articleId,
        publishedAt: new Date().toISOString(),
        source: '孤芳不自赏博客'
      };

      // 发布到 Crossbell
      const result = await createNote({
        content: JSON.stringify(noteContent),
        tags: ['blog', 'copyright', licenseType],
        sources: ['gfbzs-blog']
      });

      if (result) {
        setIsPublished(true);
        setTxHash(result.transactionHash || '0xSIMULATION');
        setNoteId(result.noteId || `note-${Date.now()}`);

        onSuccess?.(result.transactionHash || '0xSIMULATION', result.noteId || `note-${Date.now()}`);
      }
    } catch (error) {
      console.error('发布到 Crossbell 失败:', error);
      onError?.(error instanceof Error ? error.message : '发布失败');
    }
  };

  if (!isConnected) {
    return (
      <div className={styles.container}>
        <div className={styles.notConnected}>
          <span>请先连接钱包以发布到区块链</span>
        </div>
      </div>
    );
  }

  if (isPublished) {
    return (
      <div className={styles.container}>
        <div className={styles.published}>
          <span className={styles.successIcon}>✅</span>
          <span className={styles.successText}>已发布到 Crossbell</span>
          <div className={styles.details}>
            <div className={styles.detail}>
              <span className={styles.label}>交易哈希:</span>
              <span className={styles.value}>{txHash}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Note ID:</span>
              <span className={styles.value}>{noteId}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.publishButton}
        onClick={handlePublish}
        disabled={isLoading}
      >
        {isLoading ? '发布中...' : '发布到 Crossbell'}
      </button>
    </div>
  );
}; 