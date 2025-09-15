import '@testing-library/jest-dom';  // 导入@testing-library/jest-dom，用于测试DOM

// 全局测试配置
(global as any).ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
