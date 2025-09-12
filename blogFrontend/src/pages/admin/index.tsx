import React, { useState, useEffect } from 'react';
import AdminLayout from '@/admin/components/layout/AdminLayout';
import AdminRouteGuard from '@/admin/components/AdminRouteGuard/AdminRouteGuard';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { TagsAPI } from '@/api/TagsAPI';
import { CommentsAPI } from '@/api/CommentsAPI';
import { BulletinBoardAPI } from '@/api/BulletinBoardAPI';
import styles from './index.module.scss';
import Head from "next/head";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface Article {
  id: number;
  title: string;
  status: string;
  viewCount: number;
  createdAt: string;
}

interface Tag {
  id: number;
  name: string;
  color: string;
  count: number;
}

interface ArticlesResponse {
  data: Article[];
  error?: string;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  articleTitle?: string;
}

interface BulletinMessage {
  id: number;
  name: string;
  email: string;
  gender: '小哥哥' | '小姐姐';
  content: string;
  status?: 'pending' | 'approved' | 'rejected';
  reply?: string;
  replyTime?: string;
  isPinned?: boolean;
  avatar?: string;
  sendEmail?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BulletinResponse {
  records: BulletinMessage[];
  total: number;
  current: number;
  size: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalTags: 0,
    totalViews: 0,
    recentArticles: [] as Article[],
    popularTags: [] as Tag[]
  });

  const [monthlyData, setMonthlyData] = useState<{ name: string; value: number }[]>([]);
  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [recentBulletins, setRecentBulletins] = useState<BulletinMessage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 图片列表
  const imageList = [
    '/background/Ganyu.png',
    '/background/Furina.png',
    '/background/Sangonomiya.png',
    '/background/HuTao.jpg',
    '/background/Yoimiya.jpg',
    '/background/KeQing.jpg',
    '/background/Kamisato.jpg',
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 获取文章列表
      const articlesResponse = await ArticlesAPI.getArticles() as ArticlesResponse;

      // 获取带文章数量的标签列表
      const tagsResponse = await TagsAPI.getTagsWithCount();
      const tags = Array.isArray(tagsResponse) ? tagsResponse : [];

      // 获取最近评论
      try {
        const commentsResponse = await CommentsAPI.getAllComments() as Comment[];
        if (commentsResponse && Array.isArray(commentsResponse)) {
          const recentComments = commentsResponse
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
          setRecentComments(recentComments);
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }

      // 获取最近留言板消息
      try {
        const bulletinResponse = await BulletinBoardAPI.getMessages(1, 5) as BulletinResponse;
        if (bulletinResponse && bulletinResponse.records) {
          const recentBulletins = bulletinResponse.records
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
          setRecentBulletins(recentBulletins);
        }
      } catch (error) {
        console.error('Failed to fetch bulletin messages:', error);
      }

      if (!articlesResponse || !tagsResponse) {
        console.error('Failed to fetch dashboard data: No response');
        return;
      }

      if (articlesResponse && typeof articlesResponse === 'object' && 'error' in articlesResponse && articlesResponse.error) {
        console.error('Failed to fetch dashboard data:', articlesResponse.error);
        return;
      }
      if (tagsResponse && typeof tagsResponse === 'object' && !Array.isArray(tagsResponse) && 'error' in tagsResponse && tagsResponse.error) {
        console.error('Failed to fetch dashboard data:', tagsResponse.error);
        return;
      }

      const articles = articlesResponse.data || [];

      if (!Array.isArray(articles) || !Array.isArray(tags)) {
        console.error('Failed to fetch dashboard data: Invalid response format');
        return;
      }

      // 计算总浏览量
      const totalViews = articles.reduce((sum, article) => sum + (article.viewCount || 0), 0);

      // 获取最近的文章
      const recentArticles = [...articles]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      // 获取热门标签（按使用次数排序）
      const popularTags = [...tags]
        .sort((a, b) => (b.count || 0) - (a.count || 0))
        .slice(0, 5);

      setStats({
        totalArticles: articles.length,
        totalTags: tags.length,
        totalViews,
        recentArticles,
        popularTags
      });
      setMonthlyData(getMonthlyData(articles));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const getMonthlyData = (articles: Article[]) => {
    // 统计最近12个月的文章数
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    });
    const data = months.map(month => ({ name: month, value: 0 }));
    articles.forEach(article => {
      const date = new Date(article.createdAt);
      if (!isNaN(date.getTime())) {
        const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const found = data.find(d => d.name === key);
        if (found) found.value++;
      }
    });
    return data;
  };

  const handleImageClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  };

  const getImageName = (imagePath: string) => {
    const fileName = imagePath.split('/').pop() || '';
    return fileName.split('.')[0];
  };

  // 饼图颜色
  const PIE_COLORS = ['#a259ff', '#52c41a', '#faad14', '#ff4d4f', '#6c3ec1'];

  // 文章状态分布数据
  const statusData = [
    { name: '草稿', value: stats.recentArticles.filter(a => a.status === 'draft').length },
    { name: '已发布', value: stats.recentArticles.filter(a => a.status === 'published').length },
    { name: '已归档', value: stats.recentArticles.filter(a => a.status === 'archived').length },
  ];

  // 标签分布数据（前5热门标签）
  const tagData = stats.popularTags.map((tag) => ({ name: tag.name, value: tag.count || 0 }));

  return (
    <AdminRouteGuard>
      <AdminLayout>
        <div className={styles.dashboard}>
          <Head>
            <title>管理员页面 | 仪表盘</title>
            <meta name="description" />
          </Head>
          <h1 className={styles.title}>仪表盘</h1>

          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div className={styles.statContent}>
                <h3>文章总数</h3>
                <div className={styles.statValue}>{stats.totalArticles}</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </div>
              <div className={styles.statContent}>
                <h3>标签总数</h3>
                <div className={styles.statValue}>{stats.totalTags}</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <div className={styles.statContent}>
                <h3>总浏览量</h3>
                <div className={styles.statValue}>{stats.totalViews}</div>
              </div>
            </div>
          </div>

          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <h3>文章发布趋势</h3>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a259ff" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#a259ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#a259ff" fillOpacity={1} fill="url(#colorUv)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className={styles.chartCard}>
              <h3>文章状态分布</h3>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {statusData.map((entry, idx) => (
                        <Cell key={`cell-status-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className={styles.chartCard}>
              <h3>热门标签分布</h3>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={tagData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {tagData.map((entry, idx) => (
                        <Cell key={`cell-tag-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className={styles.contentRow}>
            <div className={styles.recentArticles}>
              <h2>最近文章</h2>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>标题</div>
                  <div className={styles.tableCell}>状态</div>
                  <div className={styles.tableCell}>浏览量</div>
                  <div className={styles.tableCell}>创建时间</div>
                </div>
                <div className={styles.tableBody}>
                  {stats.recentArticles.map((article) => (
                    <div key={article.id} className={styles.tableRow}>
                      <div className={styles.tableCell}>{article.title}</div>
                      <div className={styles.tableCell}>
                        <span className={`${styles.statusTag} ${article.status === 'draft' ? styles.draft : article.status === 'published' ? styles.published : styles.archived}`}>
                          {article.status === 'draft' ? '草稿' : article.status === 'published' ? '已发布' : '已归档'}
                        </span>
                      </div>
                      <div className={styles.tableCell}>{article.viewCount}</div>
                      <div className={styles.tableCell}>{new Date(article.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.popularTags}>
              <h2>热门标签</h2>
              <div className={styles.tagList}>
                {stats.popularTags && stats.popularTags.length > 0 ? (
                  stats.popularTags.map((tag) => (
                    <div key={tag.id} className={styles.tagItem}>
                      <span className={styles.tagName} style={{ color: tag.color }}>{tag.name}</span>
                      <span className={styles.tagCount}>{tag.count || 0} 篇文章</span>
                    </div>
                  ))
                ) : (
                  <div className={styles.noTags}>暂无标签数据</div>
                )}
              </div>
            </div>
          </div>

          {/* 每日一图和最近评论 */}
          <div className={styles.dailySection}>
            <div className={styles.dailyImageCard}>
              <div className={styles.cardHeader}>
                <h3>每日一图</h3>
                <div className={styles.imageCounter}>
                  {currentImageIndex + 1} / {imageList.length}
                </div>
              </div>

              <div className={styles.imageContainer} onClick={handleImageClick}>
                <div className={styles.imageWrapper}>
                  <img
                    src={imageList[currentImageIndex]}
                    alt={`每日一图 - ${getImageName(imageList[currentImageIndex])}`}
                    className={styles.dailyImage}
                  />
                </div>
                <div className={styles.imageOverlay}>
                  <div className={styles.clickHint}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>点击切换</span>
                  </div>
                </div>
              </div>

              <div className={styles.imageInfo}>
                <p className={styles.imageTitle}>{getImageName(imageList[currentImageIndex])}</p>
                <p className={styles.imageDescription}>点击图片切换下一张</p>
              </div>
            </div>

            <div className={styles.recentComments}>
              <h2>最近评论</h2>
              <div className={styles.commentList}>
                {recentComments && recentComments.length > 0 ? (
                  recentComments.map((comment) => (
                    <div key={comment.id} className={styles.commentItem}>
                      <div className={styles.commentHeader}>
                        <span className={styles.commentAuthor}>{comment.author}</span>
                        <span className={styles.commentDate}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.commentContent}>
                        {comment.content.length > 50
                          ? `${comment.content.substring(0, 50)}...`
                          : comment.content
                        }
                      </div>
                      {comment.articleTitle && (
                        <div className={styles.commentArticle}>
                          来自: {comment.articleTitle}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className={styles.noComments}>暂无评论数据</div>
                )}
              </div>
            </div>

            <div className={styles.recentBulletins}>
              <h2>最近留言</h2>
              <div className={styles.bulletinList}>
                {recentBulletins && recentBulletins.length > 0 ? (
                  recentBulletins.map((bulletin) => (
                    <div key={bulletin.id} className={styles.bulletinItem}>
                      <div className={styles.bulletinHeader}>
                        <span className={styles.bulletinName}>{bulletin.name}</span>
                        <span className={styles.bulletinGender}>{bulletin.gender}</span>
                        <span className={styles.bulletinDate}>
                          {new Date(bulletin.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.bulletinContent}>
                        {bulletin.content.length > 50
                          ? `${bulletin.content.substring(0, 50)}...`
                          : bulletin.content
                        }
                      </div>
                      <div className={styles.bulletinStatus}>
                        <span className={`${styles.statusTag} ${bulletin.status === 'approved' ? styles.approved :
                          bulletin.status === 'rejected' ? styles.rejected :
                            styles.pending
                          }`}>
                          {bulletin.status === 'approved' ? '已通过' :
                            bulletin.status === 'rejected' ? '已拒绝' : '待审核'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noBulletins}>暂无留言数据</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminRouteGuard>
  );
};

export default AdminDashboard; 