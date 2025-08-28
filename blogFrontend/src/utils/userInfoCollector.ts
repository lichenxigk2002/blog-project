/**
 * 用户信息收集工具
 * 用于收集评论用户的设备信息
 */

export interface UserDeviceInfo {
  networkOperator?: string;
  ipLocation?: string;
  browserVersion: string;
  operatingSystem: string;
  deviceType: string;
  screenResolution: string;
  userAgent: string;
}

/**
 * 获取浏览器信息
 */
export function getBrowserInfo(): string {
  const userAgent = navigator.userAgent;

  // Edge需要优先检测，因为新版本Edge的User-Agent包含Chrome
  if (userAgent.includes('Edg/')) {
    const match = userAgent.match(/Edg\/(\d+)/);
    return match ? `Edge ${match[1]}` : 'Edge';
  } else if (userAgent.includes('Firefox')) {
    const match = userAgent.match(/Firefox\/(\d+)/);
    return match ? `Firefox ${match[1]}` : 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    const match = userAgent.match(/Version\/(\d+)/);
    return match ? `Safari ${match[1]}` : 'Safari';
  } else if (userAgent.includes('Chrome')) {
    const match = userAgent.match(/Chrome\/(\d+)/);
    return match ? `Chrome ${match[1]}` : 'Chrome';
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    return 'Internet Explorer';
  }

  return 'Unknown Browser';
}

/**
 * 获取操作系统信息
 */
export function getOperatingSystem(): string {
  const userAgent = navigator.userAgent;

  if (userAgent.includes('Windows')) {
    if (userAgent.includes('Windows NT 10.0')) return 'Windows 10/11';
    if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1';
    if (userAgent.includes('Windows NT 6.2')) return 'Windows 8';
    if (userAgent.includes('Windows NT 6.1')) return 'Windows 7';
    return 'Windows';
  } else if (userAgent.includes('Mac OS X')) {
    const match = userAgent.match(/Mac OS X (\d+)_(\d+)/);
    if (match) return `macOS ${match[1]}.${match[2]}`;
    return 'macOS';
  } else if (userAgent.includes('Linux')) {
    return 'Linux';
  } else if (userAgent.includes('Android')) {
    const match = userAgent.match(/Android (\d+)/);
    return match ? `Android ${match[1]}` : 'Android';
  } else if (userAgent.includes('iOS')) {
    const match = userAgent.match(/OS (\d+)_(\d+)/);
    if (match) return `iOS ${match[1]}.${match[2]}`;
    return 'iOS';
  }

  return 'Unknown OS';
}

/**
 * 获取设备类型
 */
export function getDeviceType(): string {
  const userAgent = navigator.userAgent;

  if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    if (/iPad/i.test(userAgent)) return 'Tablet';
    return 'Mobile';
  }

  return 'Desktop';
}

/**
 * 获取屏幕分辨率
 */
export function getScreenResolution(): string {
  return `${screen.width}x${screen.height}`;
}

/**
 * 获取完整的用户设备信息
 */
export function collectUserDeviceInfo(): UserDeviceInfo {
  return {
    browserVersion: getBrowserInfo(),
    operatingSystem: getOperatingSystem(),
    deviceType: getDeviceType(),
    screenResolution: getScreenResolution(),
    userAgent: navigator.userAgent,
  };
}

/**
 * 格式化显示的用户信息
 */
export function formatUserInfoForDisplay(info: UserDeviceInfo): {
  browser: string;
  os: string;
  device: string;
  resolution: string;
} {
  return {
    browser: info.browserVersion,
    os: info.operatingSystem,
    device: info.deviceType,
    resolution: info.screenResolution,
  };
} 