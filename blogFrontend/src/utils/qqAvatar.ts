// 获取 QQ 邮箱头像工具函数
export function getQQAvatarUrl(email: string, size = 100): string | null {
    // 只检测纯数字@qq.com 的邮箱
    const match = email.match(/^([1-9][0-9]{4,10})@qq\.com$/i);
    if (!match) return null;
    const qq = match[1];
    return `https://q1.qlogo.cn/g?b=qq&nk=${qq}&s=${size}`;
}