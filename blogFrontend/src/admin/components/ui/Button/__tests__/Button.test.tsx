// src/admin/components/ui/Button/__tests__/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../Button';

describe('Button组件', () => {
  // 基础渲染测试
  describe('基础渲染', () => {
    it('应该正确渲染按钮文本', () => {
      render(<Button>点击我</Button>);
      expect(screen.getByRole('button', { name: '点击我' })).toBeInTheDocument();
    });

    it('应该应用默认样式类', () => {
      render(<Button>测试</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button', 'default', 'medium');
    });
  });

  // Variant属性测试
  describe('variant属性测试', () => {
    const variants = ['primary', 'danger', 'default', 'search', 'success', 'warning'] as const;

    variants.forEach(variant => {
      it(`应该正确应用${variant}样式`, () => {
        render(<Button variant={variant}>测试按钮</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass(variant);
      });
    });

    it('应该使用default作为默认variant', () => {
      render(<Button>默认按钮</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('default');
    });
  });

  // Size属性测试
  describe('size属性测试', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach(size => {
      it(`应该正确应用${size}尺寸`, () => {
        render(<Button size={size}>测试按钮</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass(size);
      });
    });

    it('应该使用medium作为默认size', () => {
      render(<Button>默认按钮</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('medium');
    });
  });

  // Icon属性测试
  describe('icon属性测试', () => {
    it('应该正确渲染图标和文本', () => {
      const icon = <span data-testid="test-icon">🚀</span>;
      render(<Button icon={icon}>带图标按钮</Button>);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('带图标按钮')).toBeInTheDocument();

      const iconElement = screen.getByTestId('test-icon').parentElement;
      expect(iconElement).toHaveClass('icon');
    });

    it('应该正确处理纯图标按钮', () => {
      const icon = <span data-testid="icon-only">🚀</span>;
      render(<Button icon={icon} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('iconOnly');
      expect(screen.getByTestId('icon-only')).toBeInTheDocument();
    });

    it('没有图标时不应该有iconOnly类', () => {
      render(<Button>无图标按钮</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('iconOnly');
    });
  });

  // 事件处理测试
  describe('事件处理', () => {
    it('应该正确处理点击事件', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>点击我</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('应该传递事件对象', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>点击我</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('disabled状态下不应该触发点击事件', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>禁用按钮</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // HTML属性传递测试
  describe('HTML属性传递', () => {
    it('应该正确传递自定义className', () => {
      render(<Button className="custom-class">自定义样式</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class', 'button', 'default', 'medium');
    });

    it('应该正确传递disabled属性', () => {
      render(<Button disabled>禁用按钮</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('应该正确传递type属性', () => {
      render(<Button type="submit">提交按钮</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('应该正确传递data属性', () => {
      render(<Button data-testid="custom-button">测试按钮</Button>);
      expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });
  });

  // 可访问性测试
  describe('可访问性', () => {
    it('应该支持aria-label', () => {
      render(<Button aria-label="关闭对话框">×</Button>);
      const button = screen.getByLabelText('关闭对话框');
      expect(button).toBeInTheDocument();
    });

    it('应该支持键盘导航', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>键盘测试</Button>);

      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(button).toHaveFocus();
    });
  });

  // 样式组合测试
  describe('样式组合测试', () => {
    it('应该正确组合variant和size样式', () => {
      render(<Button variant="primary" size="large">大型主要按钮</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('button', 'primary', 'large');
    });

    it('应该正确组合所有属性', () => {
      const icon = <span data-testid="combo-icon">⭐</span>;
      render(
        <Button
          variant="success"
          size="small"
          icon={icon}
          className="custom-combo"
        >
          组合测试
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button', 'success', 'small', 'custom-combo');
      expect(screen.getByTestId('combo-icon')).toBeInTheDocument();
    });
  });
});
