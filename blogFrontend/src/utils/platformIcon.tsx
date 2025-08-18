import React from 'react';
import {
  SiBilibili, SiTiktok, SiX, SiYoutube, SiSinaweibo, SiZhihu,
  SiGithub, SiFacebook, SiInstagram, SiQzone, SiTencentqq, SiWechat,
  SiDouban, SiTelegram, SiLinkedin, SiReddit, SiDiscord, SiPinterest,
  SiStackoverflow, SiMedium, SiVimeo, SiTwitch, SiDribbble, SiBehance,
  SiSlack, SiWhatsapp, SiSnapchat
} from 'react-icons/si';

const brandColors: Record<string, string> = {
  bilibili: '#00A1D6',
  tiktok: '#000000',
  twitter: '#000000',
  x: '#000000',
  youtube: '#FF0000',
  weibo: '#E6162D',
  zhihu: '#0084FF',
  github: '#181717',
  facebook: '#1877F3',
  instagram: '#E4405F',
  qzone: '#FDBE3D',
  tencentqq: '#EB1923',
  wechat: '#07C160',
  douban: '#072',
  telegram: '#26A5E4',
  linkedin: '#0A66C2',
  reddit: '#FF4500',
  discord: '#5865F2',
  pinterest: '#E60023',
  stackoverflow: '#F58025',
  medium: '#12100E',
  vimeo: '#1AB7EA',
  twitch: '#9146FF',
  dribbble: '#EA4C89',
  behance: '#1769FF',
  slack: '#4A154B',
  whatsapp: '#25D366',
  snapchat: '#FFFC00',
  gfbzsblog: '',
};

export const getPlatform = (url: string = ''): string => {
  if (url.includes('gfbzsblog.site')) return 'gfbzsblog';
  if (url.includes('bilibili.com')) return 'bilibili';
  if (url.includes('douyin.com') || url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  if (url.includes('youtube.com')) return 'youtube';
  if (url.includes('weibo.com')) return 'weibo';
  if (url.includes('zhihu.com')) return 'zhihu';
  if (url.includes('github.com')) return 'github';
  if (url.includes('facebook.com')) return 'facebook';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('qzone.qq.com')) return 'qzone';
  if (url.includes('qq.com')) return 'tencentqq';
  if (url.includes('wechat.com') || url.includes('weixin.qq.com')) return 'wechat';
  if (url.includes('douban.com')) return 'douban';
  if (url.includes('telegram.org')) return 'telegram';
  if (url.includes('linkedin.com')) return 'linkedin';
  if (url.includes('reddit.com')) return 'reddit';
  if (url.includes('discord.com')) return 'discord';
  if (url.includes('pinterest.com')) return 'pinterest';
  if (url.includes('stackoverflow.com')) return 'stackoverflow';
  if (url.includes('medium.com')) return 'medium';
  if (url.includes('vimeo.com')) return 'vimeo';
  if (url.includes('twitch.tv')) return 'twitch';
  if (url.includes('dribbble.com')) return 'dribbble';
  if (url.includes('behance.net')) return 'behance';
  if (url.includes('slack.com')) return 'slack';
  if (url.includes('whatsapp.com')) return 'whatsapp';
  if (url.includes('snapchat.com')) return 'snapchat';
  return '';
};

export const getPlatformIcon = (platform: string, props: any = {}): React.ReactNode => {
  const color = brandColors[platform];
  if (platform === 'gfbzsblog') {
    const style = { width: 72, height: 72, opacity: 0.18, ...(props && typeof props.style === 'object' ? props.style : {}) };
    return <img src="/favicon.ico" alt="gfbzsblog" style={style} {...props} />;
  }
  switch (platform) {
    case 'bilibili': return <SiBilibili color={color} {...props} />;
    case 'tiktok': return <SiTiktok color={color} {...props} />;
    case 'twitter': return <SiX color={color} {...props} />;
    case 'youtube': return <SiYoutube color={color} {...props} />;
    case 'weibo': return <SiSinaweibo color={color} {...props} />;
    case 'zhihu': return <SiZhihu color={color} {...props} />;
    case 'github': return <SiGithub color={color} {...props} />;
    case 'facebook': return <SiFacebook color={color} {...props} />;
    case 'instagram': return <SiInstagram color={color} {...props} />;
    case 'qzone': return <SiQzone color={color} {...props} />;
    case 'tencentqq': return <SiTencentqq color={color} {...props} />;
    case 'wechat': return <SiWechat color={color} {...props} />;
    case 'douban': return <SiDouban color={color} {...props} />;
    case 'telegram': return <SiTelegram color={color} {...props} />;
    case 'linkedin': return <SiLinkedin color={color} {...props} />;
    case 'reddit': return <SiReddit color={color} {...props} />;
    case 'discord': return <SiDiscord color={color} {...props} />;
    case 'pinterest': return <SiPinterest color={color} {...props} />;
    case 'stackoverflow': return <SiStackoverflow color={color} {...props} />;
    case 'medium': return <SiMedium color={color} {...props} />;
    case 'vimeo': return <SiVimeo color={color} {...props} />;
    case 'twitch': return <SiTwitch color={color} {...props} />;
    case 'dribbble': return <SiDribbble color={color} {...props} />;
    case 'behance': return <SiBehance color={color} {...props} />;
    case 'slack': return <SiSlack color={color} {...props} />;
    case 'whatsapp': return <SiWhatsapp color={color} {...props} />;
    case 'snapchat': return <SiSnapchat color={color} {...props} />;
    default: return null;
  }
}; 