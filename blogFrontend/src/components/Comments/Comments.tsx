import React, { useState, useEffect, useRef, useContext } from 'react';
import { useAppSelector } from '@/redux/store';
import { CommentsAPI } from '@/api/CommentsAPI';
import type { Comment } from '@/types/Comment';
import styles from './Comments.module.scss';
import { LoginModalContext } from '@/context/LoginModalContext';
import { CommentIcon, HeartIcon, TrashIcon, LoginIcon, SmileIcon } from '@/client/components/ui/Icons'
import OperationTipModal from '@/components/OperationTipModal/OperationTipModal';
import DOMPurify from 'dompurify';
import dynamic from 'next/dynamic';

interface CommentsProps {
  articleId: number;
  previewCommentsEnabled?: boolean; // 新增
}
const EmojiPicker = dynamic(() => import('../EmojiPicker/EmojiPicker'), { ssr: false });
const isValidAvatar = (avatar?: string | null) => {
  if (!avatar) return false;
  if (avatar.trim() === '') return false;
  if (avatar === '/default-avatar.png') return false;
  return true;
};

// 用户头像组件
const UserAvatar: React.FC<{ username: string; avatar?: string | null }> = ({ username, avatar }) => {
  const firstLetter = username.charAt(0).toUpperCase();
  const colors = ['#1890ff', '#52c41a', '#722ed1', '#eb2f96', '#fa8c16'];
  const colorIndex = username.charCodeAt(0) % colors.length;

  if (isValidAvatar(avatar)) {
    return (
      <img
        src={avatar}
        alt={username}
        className={styles.avatar}
        style={{ objectFit: 'cover', borderRadius: '50%' }}
      />
    );
  }
  return (
    <div
      className={styles.avatar}
      style={{ backgroundColor: colors[colorIndex] }}
    >
      {firstLetter}
    </div>
  );
};

// 评论操作按钮组件
const CommentActions: React.FC<{
  onReply: () => void;
  onLike: () => void;
  likes: number;
  isLiked: boolean;
  onDelete?: () => void;
  isOwner: boolean;
  isLoggedIn: boolean;
}> = ({ onReply, onLike, likes, isLiked, onDelete, isOwner, isLoggedIn }) => {
  const { setShowLogin } = useContext(LoginModalContext);

  const handleToLogin = () => {
    setShowLogin(true);
  };

  return (
    <div className={styles.commentActions}>
      {isLoggedIn ? (
        <>
          <button onClick={onReply} className={styles.actionButton}>
            <CommentIcon />
            <span>回复</span>
          </button>
          <button
            onClick={onLike}
            className={`${styles.actionButton} ${isLiked ? styles.liked : ''}`}
          >
            <HeartIcon />
            <span>{likes || '点赞'}</span>
          </button>
          {isOwner && onDelete && (
            <button onClick={onDelete} className={`${styles.actionButton} ${styles.deleteButton}`}>
              <TrashIcon />
              <span>删除</span>
            </button>
          )}
        </>
      ) : (
        <button
          onClick={handleToLogin}
          className={styles.actionButton}
        >
          <LoginIcon />
          <span>登录后参与互动</span>
        </button>
      )}
    </div>
  );
};

// 评论框组件
const CommentForm: React.FC<{
  onSubmit: (content: string, parentId?: number) => Promise<void>;
  loading: boolean;
  parentId?: number;
  onCancel?: () => void;
  placeholder?: string;
  isLoggedIn: boolean;
}> = ({ onSubmit, loading, parentId, onCancel, placeholder = "本评论区采用业界主流的 DOMPurify 过滤技术防御 XSS 攻击，安全可靠，请放心评论。", isLoggedIn }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const { setShowLogin } = useContext(LoginModalContext);

  const handleToLogin = () => {
    setShowLogin(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      handleToLogin();
      return;
    }
    if (!content.trim()) {
      setError('评论内容不能为空');
      return;
    }

    try {
      setError(null);
      await onSubmit(content.trim(), parentId);
      setContent('');
      if (onCancel) onCancel();
    } catch (err: any) {
      setError(err.message || '评论发布失败');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={`${styles.commentFormContainer} ${parentId ? styles.replyForm : ''}`}>
        <div className={styles.loginPrompt}>
          <p>请登录后发表评论</p>
          <button
            onClick={handleToLogin}
            className={styles.loginButton}
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.commentFormContainer} ${parentId ? styles.replyForm : ''}`}>
      {!parentId && <h3 className={styles.formTitle}>发表评论</h3>}
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <div className={styles.inputWrapper}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className={styles.textarea}
          />
          <button
            type="button"
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker(prev => !prev)}
            className={styles.emojiButton}
            disabled={loading}
          >
            <SmileIcon />
          </button>
          {showEmojiPicker && (
            <EmojiPicker
              onSelect={(emoji) => setContent(prev => prev + emoji)}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </div>
        <div className={styles.formActions}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
              disabled={loading}
            >
              取消
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className={styles.submitButton}
          >
            {loading ? '发布中...' : '发布评论'}
          </button>
        </div>
      </form>
    </div>
  );
};

// 单个评论组件
const CommentItem: React.FC<{
  comment: Comment;
  onReply: (comment: Comment) => void;
  onDelete: (id: number) => Promise<void>;
  onLike: (id: number) => Promise<void>;
  isLiked: boolean;
  isOwner: boolean;
  isLoggedIn: boolean;
  level?: number;
  allComments?: Comment[];
}> = ({ comment, onReply, onDelete, onLike, isLiked, isOwner, isLoggedIn, level = 0, allComments = [] }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [likes, setLikes] = useState(comment.likes || 0);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const user = useAppSelector(state => state.auth.user);

  // 查找父评论的用户名
  const parentComment = comment.parentId ? allComments.find(c => c.id === comment.parentId) : null;

  const handleLike = async () => {
    try {
      await onLike(comment.id);
      setLikes(prev => localIsLiked ? prev - 1 : prev + 1);
      setLocalIsLiked(!localIsLiked);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  return (
    <div className={`${styles.commentItem} ${level > 0 ? styles.replyItem : ''}`}>
      <div className={styles.commentMain}>
        <UserAvatar username={comment.username} avatar={comment.avatar} />
        <div className={styles.commentContent}>
          {parentComment && (
            <div className={styles.replyTo}>
              回复 <span className={styles.replyToUsername}>@{parentComment.username}</span>
            </div>
          )}
          <div className={styles.commentHeader}>
            <span className={styles.username}>{comment.username}</span>
            <span className={styles.time}>
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
          <div className={styles.commentText}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.content) }}
          />
          <CommentActions
            onReply={() => onReply(comment)}
            onLike={handleLike}
            likes={likes}
            isLiked={localIsLiked}
            onDelete={isOwner ? () => onDelete(comment.id) : undefined}
            isOwner={isOwner}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>
      {showReplyForm && isLoggedIn && (
        <div className={styles.replyFormWrapper}>
          <CommentForm
            onSubmit={async (content) => {
              // 处理回复提交
              setShowReplyForm(false);
            }}
            loading={false}
            parentId={comment.id}
            onCancel={() => setShowReplyForm(false)}
            placeholder={`回复 ${comment.username}...`}
            isLoggedIn={isLoggedIn}
          />
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.repliesList}>
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onLike={onLike}
              isLiked={false}
              isOwner={user?.id === reply.userId}
              isLoggedIn={isLoggedIn}
              level={level + 1}
              allComments={allComments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 评论列表组件
const CommentList: React.FC<{
  comments: Comment[];
  onDelete: (id: number) => Promise<void>;
  onLike: (id: number) => Promise<void>;
  loading: boolean;
  onReply: (comment: Comment) => void;
  isLoggedIn: boolean;
}> = ({ comments, onDelete, onLike, loading, onReply, isLoggedIn }) => {
  const user = useAppSelector(state => state.auth.user);
  const [visibleComments, setVisibleComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!loading) {
      setVisibleComments(comments);
    }
  }, [comments, loading]);

  return (
    <div className={styles.commentList}>
      {loading && <div className={`${styles.loading} ${styles.active}`}>加载评论中...</div>}
      {!loading && comments.length === 0 && (
        <div className={`${styles.empty} ${styles.active}`}>暂无评论，快来发表第一条评论吧！</div>
      )}
      {visibleComments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onDelete={onDelete}
          onLike={onLike}
          isLiked={false}
          isOwner={user?.id === comment.userId}
          isLoggedIn={isLoggedIn}
          allComments={comments}
        />
      ))}
    </div>
  );
};

// 主评论组件
const Comments: React.FC<CommentsProps> = ({ articleId, previewCommentsEnabled }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const user = useAppSelector(state => state.auth.user);
  const isLoggedIn = !!user;
  const [tipOpen, setTipOpen] = useState(false);
  const [tipMessage, setTipMessage] = useState('');
  const [tipType, setTipType] = useState<'success' | 'error' | 'info' | 'warning'>('error');
  const reduxCommentsEnabled = useAppSelector(state => state.settings.contentSettings.commentsEnabled);
  const commentsEnabled = typeof previewCommentsEnabled === 'boolean' ? previewCommentsEnabled : reduxCommentsEnabled;

  // 恢复 useEffect 钩子，确保组件挂载时加载评论
  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await CommentsAPI.getCommentsByArticleId(articleId);
      setComments(response);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setTipMessage(err instanceof Error ? err.message : '获取评论失败');
      setTipType('error');
      setTipOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (content: string, parentId?: number) => {
    if (!user) {
      setTipMessage('请先登录');
      setTipType('warning');
      setTipOpen(true);
      return;
    }

    try {
      const response = await CommentsAPI.addComment({
        articleId,
        userId: user.id,
        content,
        parentId: parentId || null
      } as any);

      // 处理字符串响应（成功消息）
      if (typeof response === 'string') {
        await fetchComments();
        setReplyingTo(null);
        setTipMessage('评论发布成功');
        setTipType('success');
        setTipOpen(true);
        return;
      }

      // 处理错误响应
      if ('error' in response) {
        setTipMessage(response.error || '评论发布失败');
        setTipType('error');
        setTipOpen(true);
        return;
      }

      // 处理 CommentOperationResponse
      if ('message' in response) {
        await fetchComments();
        setReplyingTo(null);
        setTipMessage(response.message || '评论发布成功');
        setTipType('success');
        setTipOpen(true);
      }
    } catch (err) {
      setTipMessage(err instanceof Error ? err.message : '评论发布失败');
      setTipType('error');
      setTipOpen(true);
    }
  };

  const handleDeleteComment = async (id: number) => {
    try {
      const response = await CommentsAPI.deleteComment(id);
      // 检查返回类型
      if (typeof response === 'string') {
        // 如果是成功消息字符串
        setComments(prev => prev.filter(c => c.id !== id));
        setTipMessage('删除成功');
        setTipType('success');
        setTipOpen(true);
        return;
      }
      if ('error' in response) {
        // 如果是错误响应
        setTipMessage(response.error || '删除失败');
        setTipType('error');
        setTipOpen(true);
        return;
      }
      // 如果是 CommentOperationResponse
      if ('message' in response) {
        setComments(prev => prev.filter(c => c.id !== id));
        setTipMessage(response.message || '删除成功');
        setTipType('success');
        setTipOpen(true);
      } else {
        setTipMessage('删除失败');
        setTipType('error');
        setTipOpen(true);
      }
    } catch (error) {
      setTipMessage(error instanceof Error ? error.message : '删除评论失败');
      setTipType('error');
      setTipOpen(true);
    }
  };

  const handleLike = async (commentId: number) => {
    if (!user) {
      setTipMessage('请先登录');
      setTipType('warning');
      setTipOpen(true);
      return;
    }
    try {
      // 实现点赞逻辑
      await CommentsAPI.likeComment(commentId);
    } catch (err: any) {
      setTipMessage(err.message || '点赞失败');
      setTipType('error');
      setTipOpen(true);
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
  };

  return (
    <div className={styles.commentsContainer}>
      <h2 className={styles.title}>评论 ({comments.length})</h2>
      {commentsEnabled ? <>
        <OperationTipModal
          open={tipOpen}
          onClose={() => setTipOpen(false)}
          message={tipMessage}
          type={tipType}
        />
        <CommentForm
          onSubmit={handleSubmit}
          loading={loading}
          parentId={replyingTo?.id}
          onCancel={replyingTo ? () => setReplyingTo(null) : undefined}
          placeholder={replyingTo ? `回复 ${replyingTo.username}...` : undefined}
          isLoggedIn={isLoggedIn}
        />
        <CommentList
          comments={comments}
          onDelete={handleDeleteComment}
          onLike={handleLike}
          loading={loading}
          onReply={handleReply}
          isLoggedIn={isLoggedIn}
        />
      </> : <div className={styles.commentFormContainer}>
        <div className={styles.loginPrompt}>
          <p>作者已关闭了评论功能</p>
        </div>
      </div>}

    </div>
  );
};

export default Comments; 