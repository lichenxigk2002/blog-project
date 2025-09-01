import React from 'react';
import styles from './SocialPlatformCard.module.scss';
import {
  FaTiktok,
  FaGithub,
  FaInstagram,
  FaTwitch,
  FaTwitter,
  FaQq,
  FaWeixin
} from 'react-icons/fa';
import { SiBilibili } from 'react-icons/si';

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  url?: string;
  copyText?: string;
  type: 'link' | 'copy';
}

interface SocialPlatformCardProps {
  onShowModal: (message: string, type: 'success' | 'info') => void;
}

const SocialPlatformCard: React.FC<SocialPlatformCardProps> = ({ onShowModal }) => {

  const socialPlatforms: SocialPlatform[] = [
    {
      id: 'douyin',
      name: '抖音',
      icon: FaTiktok,
      url: 'https://www.douyin.com/user/MS4wLjABAAAAeK227ZM7DqkdYg7Qr-KL7CSqB9B3hp8hPhtZPbjRKus?previous_page=app_code_link',
      type: 'link'
    },
    {
      id: 'bilibili',
      name: 'B站',
      icon: SiBilibili,
      url: 'https://space.bilibili.com/471764510',
      type: 'link'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/lichenxigk2002',
      type: 'link'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://www.instagram.com/lichenxigk2002/',
      type: 'link'
    },
    {
      id: 'twitch',
      name: 'Twitch',
      icon: FaTwitch,
      url: 'https://www.twitch.tv/xizi2002',
      type: 'link'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: FaTwitter,
      url: 'https://x.com/lichenxigk2002',
      type: 'link'
    },
    {
      id: 'qq',
      name: 'QQ',
      icon: FaQq,
      copyText: '624787243',
      type: 'copy'
    },
    {
      id: 'wechat',
      name: '微信',
      icon: FaWeixin,
      copyText: 'lichenxigk2002',
      type: 'copy'
    }
  ];

  const handlePlatformClick = async (platform: SocialPlatform) => {
    if (platform.type === 'link' && platform.url) {
      window.open(platform.url, '_blank');
    } else if (platform.type === 'copy' && platform.copyText) {
      try {
        await navigator.clipboard.writeText(platform.copyText);
        onShowModal(`${platform.name}已复制到剪贴板`, 'success');
      } catch (err) {
        onShowModal('复制失败，请手动复制', 'info');
      }
    }
  };

  return (
    <div className={styles.socialPlatformContainer}>
      <h1>联系我吧</h1>

      <div className={styles.socialContent}>
        <div className={styles.socialGrid}>
          {socialPlatforms.map((platform) => (
            <div
              key={platform.id}
              className={styles.socialItem}
              onClick={() => handlePlatformClick(platform)}
            >
              <div className={styles.socialIcon}>
                <platform.icon className={styles.icon} />
              </div>
              <div className={styles.socialName}>{platform.name}</div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default SocialPlatformCard; 