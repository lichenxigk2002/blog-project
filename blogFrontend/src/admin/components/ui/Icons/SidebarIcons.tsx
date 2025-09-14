import React from 'react';
import {
  FiHome,
  FiFileText,
  FiTag,
  FiMessageSquare,
  FiImage,
  FiUsers,
  FiZap,
  FiList,
  FiMessageCircle,
  FiLink,
  FiRss,
  FiSettings,
  FiMenu,
  FiLogOut
} from 'react-icons/fi';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const DashboardIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <FiHome size={size} color={color} className={className} />
);

export const ArticlesIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <FiFileText size={size} color={color} className={className} />
);

export const TagsIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <FiTag size={size} color={color} className={className} />
);

export const CommentsIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <FiMessageSquare size={size} color={color} className={className} />
);

export const GalleryIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <FiImage size={size} color={color} className={className} />
);

export const UsersIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <FiUsers size={size} color={color} className={className} />
);

export const ThoughtsIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <FiZap size={size} color={color} className={className} />
);

export const QuestionsIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <FiList size={size} color={color} className={className} />
);

export const BulletinBoardIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <FiMessageCircle size={size} color={color} className={className} />
);

export const FriendLinksIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <FiLink size={size} color={color} className={className} />
);

export const RssIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <FiRss size={size} color={color} className={className} />
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <FiSettings size={size} color={color} className={className} />
);

// 保持原来的版权图标
export const CopyrightIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9h-6v6h6V9z" />
    <path d="M12 8v8" />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className}>
    <path d="M4 6h16M4 12h16M4 18h16"></path>
  </svg>
);

export const MenuCollapsedIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className={className}>
    <path d="M4 6h16M4 12h8M4 18h16"></path>
  </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className = '' }) => (
  <FiLogOut size={size} color={color} className={className} />
);

// 图标映射函数保持不变
export const getSidebarIcon = (path: string, props: IconProps = {}) => {
  switch (path) {
    case '/admin':
      return <DashboardIcon {...props} />;
    case '/admin/articles':
      return <ArticlesIcon {...props} />;
    case '/admin/tags':
      return <TagsIcon {...props} />;
    case '/admin/comments':
      return <CommentsIcon {...props} />;
    case '/admin/gallery':
      return <GalleryIcon {...props} />;
    case '/admin/users':
      return <UsersIcon {...props} />;
    case '/admin/thoughts':
      return <ThoughtsIcon {...props} />;
    case '/admin/questions':
      return <QuestionsIcon {...props} />;
    case '/admin/bulletinboard':
      return <BulletinBoardIcon {...props} />;
    case '/admin/friendlinks':
      return <FriendLinksIcon {...props} />;
    case '/admin/friendlinks/rss':
      return <RssIcon {...props} />;
    case '/admin/settings':
      return <SettingsIcon {...props} />;
    case '/admin/copyright':
      return <CopyrightIcon {...props} />;
    default:
      return null;
  }
}; 