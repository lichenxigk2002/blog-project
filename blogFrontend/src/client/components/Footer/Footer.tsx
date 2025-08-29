import React, { useEffect, useState } from 'react';
import styles from './Footer.module.scss';
import { useTheme } from '@/hooks/useTheme';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { GalleryAPI } from '@/api/GalleryAPI';
import { Article } from '@/types/Article';
import { FaGithub, FaCloud, FaTachometerAlt, FaRss, FaWeixin } from 'react-icons/fa';
import { FiMail, FiMapPin } from 'react-icons/fi';
import { SiBilibili, SiTiktok } from 'react-icons/si';
import Link from "next/link";
import { navRoutesItem } from "@/routes/nav-routes";
import SubscribeModal from '@/components/SubscribeModal/SubscribeModal';
import RssSubscribe from '@/components/RssSubscribe/RssSubscribe';
import OnlineUsers from '@/components/OnlineUsers/OnlineUsers';
import { useSelector } from "react-redux";


// 扩展 Performance 接口以包含 memory 属性
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
}

const PerformanceMonitor: React.FC = () => {
  const emailNotifications = useSelector((state: any) => state.settings.notificationSettings.emailNotifications)
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    memory: 0
  });

  useEffect(() => {
    // 计算页面加载时间
    const loadTime = performance.now();
    setMetrics(prev => ({ ...prev, loadTime }));

    // 获取内存使用情况（如果浏览器支持）
    if (performance.memory) {
      const memory = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
      setMetrics(prev => ({ ...prev, memory }));
    }

    // 定期更新内存使用情况
    const interval = setInterval(() => {
      if (performance.memory) {
        const memory = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
        setMetrics(prev => ({ ...prev, memory }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.performanceMonitor}>
      <FaTachometerAlt className={styles.performanceIcon} />
      <span>加载: {metrics.loadTime.toFixed(0)}ms</span>
      {metrics.memory > 0 && <span>内存: {metrics.memory}MB</span>}
    </div>
  );
};

const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();
  const [stats, setStats] = useState({
    articles: 0,
    galleries: 0
  });
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showRssSubscribe, setShowRssSubscribe] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 获取文章数量
        const articlesResponse = await ArticlesAPI.getArticlesSimple();
        const articles = articlesResponse.data as Article[];
        // 获取相册数量
        const galleries = await GalleryAPI.getGalleries();

        setStats({
          articles: articles.filter(article => article.status === 'published').length,
          galleries: Array.isArray(galleries) ? galleries.length : 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>关于我のBlog</h3>
          <p>用文字定格时光，以技术点亮灵感，在笔尖与代码间探索无限可能</p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{stats.articles}</span>
              <span className={styles.statLabel}>文章</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{stats.galleries}</span>
              <span className={styles.statLabel}>相册</span>
            </div>
            <div className={styles.stat}>
              <OnlineUsers />
            </div>
          </div>
        </div>
        <div className={styles.footerSection}>
          <h3>联系我</h3>
          <div className={styles.contactInfo}>
            <a href="mailto:chenxili380@gmail.com" className={styles.contactItem}>
              <FiMail />Email: chenxili380@gmail.com
            </a>
            <p className={styles.contactItem}><FaWeixin />WeChat: lichenxigk2002</p>
            <a
              href="https://map.baidu.com/search/洛阳/@12663647.325,4107550.88,12z?querytype=s&da_src=shareurl&wd=洛阳&c=131&src=0&pn=0&sug=0&l=12&b=(12663247.325,4107550.88;12664047.325,4107550.88)&from=webmap&biz_forward=%7B%22scaler%22:2,%22styles%22:%22pl%22%7D&device_ratio=2"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
            >
              <FiMapPin />城市: 洛阳
            </a>
          </div>
        </div>
        <div className={styles.footerSection}>
          <h3>其他社交方式</h3>
          <div className={styles.links}>
            <a href="https://github.com/lichenxigk2002" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaGithub className={styles.socialIcon} data-icon="github" />
              <span>GitHub</span>
            </a>
            <a href="https://b23.tv/BZ0L6Gu" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <SiBilibili className={styles.socialIcon} data-icon="bilibili" />
              <span>Bilibili</span>
            </a>
            <a href="https://v.douyin.com/x3B6KXOh924/ 7@2.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <SiTiktok className={styles.socialIcon} data-icon="tiktok" />
              <span>抖音</span>
            </a>
          </div>
          <div className={styles.quickLinks}>
            {navRoutesItem
              .filter(item => item.id < 8)
              .map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                >
                  {item.name}
                </Link>
              ))}
            <button
              className={styles.quickLinkBtn}
              onClick={() => setShowSubscribe(true)}
              type="button"
            >
              <FiMail style={{ marginRight: '0.4em', verticalAlign: '-0.1em' }} data-icon="envelope" />
              邮件订阅
            </button>
            <button
              className={styles.quickLinkBtn}
              onClick={() => setShowRssSubscribe(true)}
              type="button"
            >
              <FaRss style={{ marginRight: '0.4em', verticalAlign: '-0.1em' }} data-icon="rss" />
              RSS订阅
            </button>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <PerformanceMonitor />
        <p>© {currentYear} 孤芳不自赏的博客已持续运行 {Math.floor((Date.now() - new Date('2024-05-26').getTime()) / 86400000)} 天 | 所有内容均为原创，保留所有权利 | Powered by <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}><img src="/technologyStack/NextJS.png" alt="Next.js" style={{ height: '12px', verticalAlign: 'middle', margin: '0 2px', cursor: 'pointer' }} /></a> Next.js + <a href="https://spring.io" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}><img src="/technologyStack/spring.png" alt="Spring Boot" style={{ height: '12px', verticalAlign: 'middle', margin: '0 2px', cursor: 'pointer' }} /></a> Spring Boot</p>

        <div className={styles.serviceProviders}>
          {/* 添加腾讯云主品牌图标 */}
          <a
            href="https://cloud.tencent.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mainBrand}
          >
            <img
              src="/images/TencentCloud.svg"  // 建议使用官方SVG
              alt="腾讯云"
              style={{ height: '1rem', verticalAlign: 'middle' }}
            />
          </a>
          <span>由</span>

          {/* 子服务列表 */}
          <a href="https://cloud.tencent.com/product/cdn" target="_blank" rel="noopener noreferrer">
            <img
              src="/images/ContentDeliveryNetWork.svg"
              alt="CDN"
              style={{ width: '0.75rem', verticalAlign: 'middle' }}
            />
            CDN
          </a>
          <span>、</span>

          <a href="https://cloud.tencent.com/product/cos" target="_blank" rel="noopener noreferrer">
            <img
              src="/images/CloudObjectStorage.svg"
              alt="COS"
              style={{ width: '0.75rem', verticalAlign: 'middle' }}
            />
            COS
          </a>
          <span>、</span>

          <a href="https://cloud.tencent.com/product/ses" target="_blank" rel="noopener noreferrer">
            <img
              src="/images/SimpleEmailService.svg"  // 邮件推送
              alt="SES"
              style={{ width: '0.75rem', verticalAlign: 'middle' }}
            />
            SES
          </a>
          <span>和</span>

          <a href="https://cloud.tencent.com/product/lighthouse" target="_blank" rel="noopener noreferrer">
            <img
              src="/images/TencentCloudLighthouse.svg"  // 轻量服务器图标
              alt="轻量服务器"
              style={{ width: '0.75rem', verticalAlign: 'middle' }}
            />
            轻量应用服务器
          </a>
          <span>提供技术支持</span>
        </div>
        <div className={styles.footerBottomBox}>
          <a href="https://beian.miit.gov.cn" className={styles.beianBadge} target="_blank" rel="noopener noreferrer">
            晋ICP备2025060785号
          </a>
          <a href="https://bloginc.kamyang.com/tech-expert/18852.html">
            <div className={styles.footerBadgeWrapper}>
              <div className={styles.footerBadgeLeft}>
                晓梦羊&reg;
              </div>
              <div className={styles.footerBadgeRight}>
                18852号
              </div>
            </div>
          </a>
        </div>
      </div>
      <SubscribeModal open={showSubscribe} onClose={() => setShowSubscribe(false)} />
      <RssSubscribe open={showRssSubscribe} onClose={() => setShowRssSubscribe(false)} />
    </footer>
  );
};

export default Footer; 