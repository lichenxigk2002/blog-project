import React, { useState, useEffect } from 'react';
import styles from './HashEvidenceForm.module.scss';
import FormItem from '../ui/FormItem/FormItem';
import FormInput from '../ui/FormInput/FormInput';
import Button from '../ui/Button/Button';
import { CopyrightAPI } from '@/api/CopyrightAPI';
import type { ArticleCopyright } from '@/types/Copyright';

interface HashEvidenceFormProps {
  articleId: number;
  articleTitle?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const HashEvidenceForm: React.FC<HashEvidenceFormProps> = ({
  articleId,
  articleTitle,
  onClose,
  onSuccess
}) => {
  const [copyrightInfo, setCopyrightInfo] = useState<ArticleCopyright | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [hashValue, setHashValue] = useState('');
  const [noteId, setNoteId] = useState('');

  useEffect(() => {
    fetchCopyrightInfo();
  }, [articleId]);

  const fetchCopyrightInfo = async () => {
    try {
      setLoading(true);
      const response = await CopyrightAPI.getArticleCopyright(articleId);
      if (response && !('error' in response)) {
        setCopyrightInfo(response);
        setHashValue(response.blockchainTxHash || '');
        setNoteId(response.noteId || '');
      }
    } catch (error) {
      console.error('获取版权信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hashValue.trim()) {
      alert('请输入哈希值');
      return;
    }

    try {
      setUpdating(true);
      await CopyrightAPI.updateBlockchainInfo(articleId, hashValue.trim(), noteId.trim());

      // 重新获取最新数据
      await fetchCopyrightInfo();

      if (onSuccess) {
        onSuccess();
      }

      alert('哈希存证更新成功！');
    } catch (error) {
      console.error('更新哈希存证失败:', error);
      alert('更新哈希存证失败，请重试');
    } finally {
      setUpdating(false);
    }
  };

  const formatHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const getCrossbellExplorerUrl = (txHash: string) => {
    return `https://scan.crossbell.io/tx/${txHash}`;
  };

  const getCrossbellUrl = (noteId: string) => {
    return `https://crossbell.io/notes/${noteId}`;
  };

  if (loading) {
    return (
      <div className={styles.form}>
        <div className={styles.loading}>加载中...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {articleTitle && (
        <FormItem>
          <FormInput
            type="text"
            name="articleTitle"
            value={articleTitle}
            onChange={() => { }}
            placeholder=""
            label="文章标题"
            disabled
          />
        </FormItem>
      )}

      <FormItem>
        <FormInput
          type="text"
          name="hashValue"
          value={hashValue}
          onChange={(e) => setHashValue(e.target.value)}
          placeholder="请输入区块链交易哈希值"
          label="区块链交易哈希"
          required
        />
      </FormItem>



      {/* 当前存证状态显示 */}
      {copyrightInfo && (
        <FormItem>
          <div className={styles.currentStatus}>
            <h4 className={styles.statusTitle}>当前存证状态</h4>

            {copyrightInfo.blockchainTxHash ? (
              <div className={styles.statusContent}>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>存证状态：</span>
                  <span className={`${styles.statusValue} ${styles.success}`}>已存证</span>
                </div>

                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>交易哈希：</span>
                  <a
                    href={getCrossbellExplorerUrl(copyrightInfo.blockchainTxHash)}
                    className={styles.hashLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="在Crossbell区块浏览器中查看"
                  >
                    {formatHash(copyrightInfo.blockchainTxHash)}
                  </a>
                </div>



                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>存证时间：</span>
                  <span className={styles.statusValue}>
                    {new Date(copyrightInfo.updatedAt).toLocaleString('zh-CN')}
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.statusContent}>
                <div className={styles.statusItem}>
                  <span className={styles.statusLabel}>存证状态：</span>
                  <span className={`${styles.statusValue} ${styles.warning}`}>未存证</span>
                </div>
                <div className={styles.statusDescription}>
                  该文章尚未进行区块链存证，请填写交易哈希进行存证。
                </div>
              </div>
            )}
          </div>
        </FormItem>
      )}

      <FormItem>
        <div className={styles.buttonRow}>
          <Button type="button" variant="default" onClick={onClose} className={styles.cancelButton}>
            取消
          </Button>
          <Button
            type="submit"
            variant="primary"
            className={styles.submitButton}
            disabled={updating}
          >
            {updating ? '更新中...' : '更新存证'}
          </Button>
        </div>
      </FormItem>
    </form>
  );
};

export default HashEvidenceForm; 