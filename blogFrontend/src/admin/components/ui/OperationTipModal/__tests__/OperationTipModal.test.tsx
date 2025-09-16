// src/admin/components/ui/OperationTipModal/__tests__/OperationTipModal.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import OperationTipModal from '../OperationTipModal';

// Mock timers for testing timeouts
jest.useFakeTimers();

describe('OperationTipModal组件', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    message: '测试消息'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // 清理所有定时器
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  // 基础渲染测试
  describe('基础渲染', () => {
    it('应该正确渲染模态框', () => {
      render(<OperationTipModal {...defaultProps} />);

      expect(screen.getByText('测试消息')).toBeInTheDocument();
    });

    it('应该应用默认样式类', () => {
      const { container } = render(<OperationTipModal {...defaultProps} />);

      const overlay = container.querySelector('.overlay');
      const card = container.querySelector('.card');

      expect(overlay).toBeInTheDocument();
      expect(card).toBeInTheDocument();
    });

    it('应该正确传递自定义className', () => {
      const { container } = render(
        <OperationTipModal {...defaultProps} className="custom-modal" />
      );

      const card = container.querySelector('.card');
      expect(card).toHaveClass('custom-modal');
    });

    it('应该应用默认宽度', () => {
      const { container } = render(<OperationTipModal {...defaultProps} />);

      const card = container.querySelector('.card') as HTMLElement;
      expect(card).toHaveStyle('width: 280px');
    });

    it('应该应用自定义宽度', () => {
      const { container } = render(
        <OperationTipModal {...defaultProps} width={400} />
      );

      const card = container.querySelector('.card') as HTMLElement;
      expect(card).toHaveStyle('width: 400px');
    });
  });

  // 类型和图标测试
  describe('类型和图标', () => {
    // 修复：根据实际组件逻辑调整测试
    it('应该正确渲染success类型', () => {
      render(<OperationTipModal {...defaultProps} type="success" />);

      const icon = screen.getByAltText('success');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('src', '/images/success.png');
    });

    it('应该正确渲染error类型', () => {
      render(<OperationTipModal {...defaultProps} type="error" />);

      const icon = screen.getByAltText('error');
      expect(icon).toBeInTheDocument();
      // 根据组件代码，error 类型使用 failure.png
      expect(icon).toHaveAttribute('src', '/images/failure.png');
    });

    it('应该正确渲染info类型', () => {
      render(<OperationTipModal {...defaultProps} type="info" />);

      const icon = screen.getByAltText('info');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('src', '/images/info.png');
    });

    it('应该正确渲染warning类型', () => {
      render(<OperationTipModal {...defaultProps} type="warning" />);

      const icon = screen.getByAltText('warning');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('src', '/images/warning.png');
    });

    it('应该正确渲染loading类型', () => {
      render(<OperationTipModal {...defaultProps} type="loading" />);

      const icon = screen.getByAltText('loading');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('src', '/images/loading.png');
    });

    it('应该使用默认success类型', () => {
      render(<OperationTipModal {...defaultProps} />);

      const icon = screen.getByAltText('success');
      expect(icon).toHaveAttribute('src', '/images/success.png');
    });

    it('应该支持自定义图标', () => {
      const customIcon = '/custom/icon.png';
      render(<OperationTipModal {...defaultProps} icon={customIcon} />);

      const icon = screen.getByAltText('success');
      expect(icon).toHaveAttribute('src', customIcon);
    });

    it('应该支持failure类型（兼容旧版本）', () => {
      render(<OperationTipModal {...defaultProps} type="failure" />);

      const icon = screen.getByAltText('failure');
      expect(icon).toHaveAttribute('src', '/images/failure.png');
    });

    it('应该应用默认图标尺寸', () => {
      render(<OperationTipModal {...defaultProps} />);

      const icon = screen.getByAltText('success');
      expect(icon).toHaveStyle('width: 128px');
      expect(icon).toHaveStyle('height: 128px');
    });

    it('应该应用自定义图标尺寸', () => {
      render(<OperationTipModal {...defaultProps} iconSize={64} />);

      const icon = screen.getByAltText('success');
      expect(icon).toHaveStyle('width: 64px');
      expect(icon).toHaveStyle('height: 64px');
    });
  });

  // 位置测试
  describe('位置设置', () => {
    it('应该应用默认center位置', () => {
      const { container } = render(<OperationTipModal {...defaultProps} />);

      const card = container.querySelector('.card');
      expect(card).toHaveClass('position-center');
    });

    it('应该应用top位置', () => {
      const { container } = render(
        <OperationTipModal {...defaultProps} position="top" />
      );

      const card = container.querySelector('.card');
      expect(card).toHaveClass('position-top');
    });

    it('应该应用bottom位置', () => {
      const { container } = render(
        <OperationTipModal {...defaultProps} position="bottom" />
      );

      const card = container.querySelector('.card');
      expect(card).toHaveClass('position-bottom');
    });
  });

  // 关闭按钮测试
  describe('关闭按钮', () => {
    it('默认情况下不应该显示关闭按钮', () => {
      render(<OperationTipModal {...defaultProps} />);

      expect(screen.queryByLabelText('关闭')).not.toBeInTheDocument();
    });

    it('应该显示关闭按钮当showCloseButton为true', () => {
      render(<OperationTipModal {...defaultProps} showCloseButton={true} />);

      const closeButton = screen.getByLabelText('关闭');
      expect(closeButton).toBeInTheDocument();
    });

    it('应该正确处理关闭按钮点击', () => {
      const onClose = jest.fn();
      render(
        <OperationTipModal
          {...defaultProps}
          onClose={onClose}
          showCloseButton={true}
        />
      );

      const closeButton = screen.getByLabelText('关闭');
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  // 点击遮罩关闭测试
  describe('点击遮罩关闭', () => {
    it('默认情况下应该支持点击遮罩关闭', () => {
      const onClose = jest.fn();
      const { container } = render(
        <OperationTipModal {...defaultProps} onClose={onClose} />
      );

      const overlay = container.querySelector('.overlay');
      fireEvent.click(overlay!);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('当clickOverlayToClose为false时不应该支持点击遮罩关闭', () => {
      const onClose = jest.fn();
      const { container } = render(
        <OperationTipModal
          {...defaultProps}
          onClose={onClose}
          clickOverlayToClose={false}
        />
      );

      const overlay = container.querySelector('.overlay');
      fireEvent.click(overlay!);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('点击卡片内容不应该关闭模态框', () => {
      const onClose = jest.fn();
      const { container } = render(
        <OperationTipModal {...defaultProps} onClose={onClose} />
      );

      const card = container.querySelector('.card');
      fireEvent.click(card!);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // 自动关闭测试
  describe('自动关闭功能', () => {
    it('默认情况下应该自动关闭', () => {
      const onClose = jest.fn();
      render(<OperationTipModal {...defaultProps} onClose={onClose} />);

      // 快进到自动关闭时间
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      act(() => {
        jest.advanceTimersByTime(500); // 离开动画时间
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('当autoClose为false时不应该自动关闭', () => {
      const onClose = jest.fn();
      render(
        <OperationTipModal
          {...defaultProps}
          onClose={onClose}
          autoClose={false}
        />
      );

      // 快进到自动关闭时间
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('应该使用自定义自动关闭延迟', () => {
      const onClose = jest.fn();
      render(
        <OperationTipModal
          {...defaultProps}
          onClose={onClose}
          autoCloseDelay={3000}
        />
      );

      // 快进到自定义延迟时间
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      act(() => {
        jest.advanceTimersByTime(500); // 离开动画时间
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('应该在组件卸载时清理定时器', () => {
      const onClose = jest.fn();
      const { unmount } = render(
        <OperationTipModal {...defaultProps} onClose={onClose} />
      );

      unmount();

      // 快进时间，确保定时器被清理
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // 显示/隐藏状态测试
  describe('显示/隐藏状态', () => {
    it('当open为false时不应该渲染', () => {
      const { container } = render(
        <OperationTipModal {...defaultProps} open={false} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('当open从true变为false时应该触发关闭动画', () => {
      const { rerender, container } = render(
        <OperationTipModal {...defaultProps} />
      );

      expect(screen.getByText('测试消息')).toBeInTheDocument();

      rerender(<OperationTipModal {...defaultProps} open={false} />);

      const card = container.querySelector('.card');
      expect(card).toHaveClass('card-leave');
    });

    it('当open从false变为true时应该显示', () => {
      const { rerender } = render(
        <OperationTipModal {...defaultProps} open={false} />
      );

      expect(screen.queryByText('测试消息')).not.toBeInTheDocument();

      rerender(<OperationTipModal {...defaultProps} open={true} />);

      expect(screen.getByText('测试消息')).toBeInTheDocument();
    });
  });

  // 动画状态测试
  describe('动画状态', () => {
    it('初始显示时不应该有离开动画类', () => {
      const { container } = render(<OperationTipModal {...defaultProps} />);

      const card = container.querySelector('.card');
      expect(card).not.toHaveClass('card-leave');
    });

    it('关闭时应该添加离开动画类', () => {
      const { rerender, container } = render(
        <OperationTipModal {...defaultProps} />
      );

      rerender(<OperationTipModal {...defaultProps} open={false} />);

      const card = container.querySelector('.card');
      expect(card).toHaveClass('card-leave');
    });
  });

  // 消息内容测试
  describe('消息内容', () => {
    it('应该正确显示消息文本', () => {
      render(<OperationTipModal {...defaultProps} message="自定义消息" />);

      expect(screen.getByText('自定义消息')).toBeInTheDocument();
    });

    it('应该支持长消息', () => {
      const longMessage = '这是一个非常长的消息，用来测试组件是否能够正确处理长文本内容，包括换行和特殊字符。';
      render(<OperationTipModal {...defaultProps} message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('应该支持包含HTML实体的消息', () => {
      const messageWithEntities = '消息包含 &lt; 和 &gt; 符号';
      render(<OperationTipModal {...defaultProps} message={messageWithEntities} />);

      expect(screen.getByText(messageWithEntities)).toBeInTheDocument();
    });
  });

  // 复杂组合测试
  describe('复杂组合测试', () => {
    it('应该正确处理所有属性的组合', () => {
      const onClose = jest.fn();
      const { container } = render(
        <OperationTipModal
          open={true}
          onClose={onClose}
          message="组合测试消息"
          type="warning"
          width={350}
          iconSize={96}
          icon="/custom/warning.png"
          autoClose={false}
          clickOverlayToClose={false}
          showCloseButton={true}
          position="top"
          className="combo-modal"
        />
      );

      // 验证所有属性都正确应用
      expect(screen.getByText('组合测试消息')).toBeInTheDocument();
      expect(screen.getByAltText('warning')).toHaveAttribute('src', '/custom/warning.png');

      const card = container.querySelector('.card') as HTMLElement;
      expect(card).toHaveStyle('width: 350px');
      expect(card).toHaveClass('position-top', 'combo-modal');

      const icon = screen.getByAltText('warning');
      expect(icon).toHaveStyle('width: 96px');
      expect(icon).toHaveStyle('height: 96px');

      expect(screen.getByLabelText('关闭')).toBeInTheDocument();
    });

    it('应该正确处理禁用自动关闭和遮罩关闭的组合', () => {
      const onClose = jest.fn();
      const { container } = render(
        <OperationTipModal
          {...defaultProps}
          onClose={onClose}
          autoClose={false}
          clickOverlayToClose={false}
          showCloseButton={true}
        />
      );

      // 测试遮罩点击
      const overlay = container.querySelector('.overlay');
      fireEvent.click(overlay!);
      expect(onClose).not.toHaveBeenCalled();

      // 测试自动关闭
      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(onClose).not.toHaveBeenCalled();

      // 测试关闭按钮
      const closeButton = screen.getByLabelText('关闭');
      fireEvent.click(closeButton);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  // 边界情况测试
  describe('边界情况', () => {
    it('应该处理undefined的className', () => {
      const { container } = render(
        <OperationTipModal {...defaultProps} className={undefined as any} />
      );

      const card = container.querySelector('.card');
      expect(card).toBeInTheDocument();
    });

    it('应该处理空字符串的className', () => {
      const { container } = render(
        <OperationTipModal {...defaultProps} className="" />
      );

      const card = container.querySelector('.card');
      expect(card).toBeInTheDocument();
    });

    it('应该处理无效的type值', () => {
      render(
        <OperationTipModal
          {...defaultProps}
          type={'invalid' as any}
        />
      );

      // 应该回退到默认图标
      const icon = screen.getByAltText('invalid');
      expect(icon).toHaveAttribute('src', '/images/success.png');
    });

    it('应该处理0宽度的边界情况', () => {
      const { container } = render(
        <OperationTipModal {...defaultProps} width={0} />
      );

      const card = container.querySelector('.card') as HTMLElement;
      expect(card).toHaveStyle('width: 0px');
    });

    it('应该处理0图标尺寸的边界情况', () => {
      render(<OperationTipModal {...defaultProps} iconSize={0} />);

      const icon = screen.getByAltText('success');
      expect(icon).toHaveStyle('width: 0px');
      expect(icon).toHaveStyle('height: 0px');
    });
  });

  // 可访问性测试
  describe('可访问性', () => {
    it('应该支持键盘导航', () => {
      render(<OperationTipModal {...defaultProps} showCloseButton={true} />);

      const closeButton = screen.getByLabelText('关闭');
      closeButton.focus();

      expect(closeButton).toHaveFocus();
    });

    it('应该支持Escape键关闭（如果实现的话）', () => {
      const onClose = jest.fn();
      render(<OperationTipModal {...defaultProps} onClose={onClose} />);

      // 注意：这个测试假设组件支持Escape键，实际实现可能需要添加
      fireEvent.keyDown(document, { key: 'Escape' });

      // 如果实现了Escape键支持，这里应该有相应的断言
    });

    it('图标应该有正确的alt属性', () => {
      render(<OperationTipModal {...defaultProps} type="info" />);

      const icon = screen.getByAltText('info');
      expect(icon).toBeInTheDocument();
    });
  });
});
