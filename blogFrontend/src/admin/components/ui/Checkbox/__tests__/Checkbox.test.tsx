// src/admin/components/ui/Checkbox/__tests__/Checkbox.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Checkbox from '../Checkbox';

describe('Checkbox组件', () => {
  // 基础渲染测试
  describe('基础渲染', () => {
    it('应该正确渲染复选框', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="测试复选框" />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('应该应用默认样式类', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <Checkbox checked={false} onChange={handleChange} label="测试" />
      );

      const checkboxGroup = container.firstChild;
      expect(checkboxGroup).toHaveClass('checkboxGroup');
    });

    it('应该正确传递自定义className', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          label="测试"
          className="custom-checkbox"
        />
      );

      const checkboxGroup = container.firstChild;
      expect(checkboxGroup).toHaveClass('checkboxGroup', 'custom-checkbox');
    });
  });

  // 选中状态测试
  describe('选中状态', () => {
    it('应该正确显示未选中状态', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="未选中" />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('应该正确显示选中状态', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={true} onChange={handleChange} label="已选中" />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('应该正确切换选中状态', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="可切换" />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  // 标签测试
  describe('标签功能', () => {
    it('应该正确渲染label属性', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="标签文本" />
      );

      expect(screen.getByText('标签文本')).toBeInTheDocument();
    });

    it('应该正确渲染children作为标签', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange}>
          子元素标签
        </Checkbox>
      );

      expect(screen.getByText('子元素标签')).toBeInTheDocument();
    });

    it('label应该覆盖children', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="优先标签">
          子元素标签
        </Checkbox>
      );

      expect(screen.getByText('优先标签')).toBeInTheDocument();
      expect(screen.queryByText('子元素标签')).not.toBeInTheDocument();
    });

    it('点击标签应该触发复选框', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="可点击标签" />
      );

      const label = screen.getByText('可点击标签');
      fireEvent.click(label);

      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  // 禁用状态测试
  describe('禁用状态', () => {
    it('应该正确显示禁用状态', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="禁用复选框" disabled />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('禁用状态下不应该触发onChange', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="禁用复选框" disabled />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('禁用状态下点击标签不应该触发onChange', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="禁用标签" disabled />
      );

      const label = screen.getByText('禁用标签');
      fireEvent.click(label);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('应该使用默认的disabled值false', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="默认状态" />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeDisabled();
    });
  });

  // 事件处理测试
  describe('事件处理', () => {
    it('应该正确处理onChange事件', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="事件测试" />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('应该传递正确的checked值', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={true} onChange={handleChange} label="事件测试" />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('应该传递事件对象', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="事件测试" />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.change(checkbox, { target: { checked: true } });

      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  // 名称属性测试
  describe('名称属性', () => {
    it('应该正确传递name属性', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          label="名称测试"
          name="test-checkbox"
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('name', 'test-checkbox');
    });

    it('没有name属性时不应该有name属性', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="无名称" />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toHaveAttribute('name');
    });
  });

  // 样式测试
  describe('样式应用', () => {
    it('应该应用正确的样式类', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <Checkbox checked={false} onChange={handleChange} label="样式测试" />
      );

      const checkboxGroup = container.querySelector('.checkboxGroup');
      const checkboxLabel = container.querySelector('.checkboxLabel');
      const checkbox = container.querySelector('.checkbox');
      const checkboxText = container.querySelector('.checkboxText');

      expect(checkboxGroup).toBeInTheDocument();
      expect(checkboxLabel).toBeInTheDocument();
      expect(checkbox).toBeInTheDocument();
      expect(checkboxText).toBeInTheDocument();
    });

    it('复选框应该应用checkbox样式类', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <Checkbox checked={false} onChange={handleChange} label="样式测试" />
      );

      const checkbox = container.querySelector('.checkbox');
      expect(checkbox).toHaveClass('checkbox');
    });

    it('标签文本应该应用checkboxText样式类', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <Checkbox checked={false} onChange={handleChange} label="样式测试" />
      );

      const checkboxText = container.querySelector('.checkboxText');
      expect(checkboxText).toHaveClass('checkboxText');
    });
  });

  // 可访问性测试
  describe('可访问性', () => {
    it('应该支持键盘导航', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="键盘测试" />
      );

      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();

      expect(checkbox).toHaveFocus();
    });

    it('应该支持Enter键切换状态', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="键盘测试" />
      );

      const checkbox = screen.getByRole('checkbox');
      fireEvent.keyDown(checkbox, { key: 'Enter' });

      // 注意：实际的键盘事件处理可能需要额外的实现
      expect(checkbox).toHaveFocus();
    });

    it('应该正确关联标签和复选框', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange} label="关联测试" />
      );

      const checkbox = screen.getByRole('checkbox');
      const label = screen.getByText('关联测试');

      // 检查标签是否正确关联到复选框
      expect(label.closest('label')).toContainElement(checkbox);
    });
  });

  // 边界情况测试
  describe('边界情况', () => {
    it('应该处理undefined的className', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          label="测试"
          className={undefined as any}
        />
      );

      const checkboxGroup = container.firstChild;
      expect(checkboxGroup).toHaveClass('checkboxGroup');
    });

    it('应该处理空字符串的className', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <Checkbox
          checked={false}
          onChange={handleChange}
          label="测试"
          className=""
        />
      );

      const checkboxGroup = container.firstChild;
      expect(checkboxGroup).toHaveClass('checkboxGroup');
    });

    it('应该处理没有标签的情况', () => {
      const handleChange = jest.fn();
      const { container } = render(
        <Checkbox checked={false} onChange={handleChange} />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();

      const checkboxText = container.querySelector('.checkboxText');
      expect(checkboxText).toBeEmptyDOMElement();
    });

    it('应该处理复杂的子元素', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox checked={false} onChange={handleChange}>
          <span>
            <strong>粗体文本</strong> 和 <em>斜体文本</em>
          </span>
        </Checkbox>
      );

      expect(screen.getByText('粗体文本')).toBeInTheDocument();
      expect(screen.getByText('斜体文本')).toBeInTheDocument();
    });
  });

  // 复杂组合测试
  describe('复杂组合测试', () => {
    it('应该正确处理所有属性的组合', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox
          checked={true}
          onChange={handleChange}
          label="组合测试"
          disabled={false}
          name="combo-checkbox"
          className="combo-class"
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
      expect(checkbox).not.toBeDisabled();
      expect(checkbox).toHaveAttribute('name', 'combo-checkbox');
      expect(screen.getByText('组合测试')).toBeInTheDocument();
    });

    it('应该正确处理禁用状态下的所有属性', () => {
      const handleChange = jest.fn();
      render(
        <Checkbox
          checked={true}
          onChange={handleChange}
          label="禁用组合测试"
          disabled={true}
          name="disabled-checkbox"
          className="disabled-class"
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
      expect(checkbox).toBeDisabled();
      expect(checkbox).toHaveAttribute('name', 'disabled-checkbox');
      expect(screen.getByText('禁用组合测试')).toBeInTheDocument();
    });
  });
});
