// src/admin/components/ui/FormItem/__tests__/FormItem.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormItem from '../FormItem';

describe('FormItem组件', () => {
  // 基础渲染测试
  describe('基础渲染', () => {
    it('应该正确渲染子元素', () => {
      render(
        <FormItem>
          <input type="text" placeholder="测试输入框" />
        </FormItem>
      );

      expect(screen.getByPlaceholderText('测试输入框')).toBeInTheDocument();
    });

    it('应该应用默认样式类', () => {
      const { container } = render(
        <FormItem>
          <div>测试内容</div>
        </FormItem>
      );

      const formItem = container.firstChild;
      expect(formItem).toHaveClass('formItem');
    });

    it('应该正确传递自定义className', () => {
      const { container } = render(
        <FormItem className="custom-form-item">
          <div>测试内容</div>
        </FormItem>
      );

      const formItem = container.firstChild;
      expect(formItem).toHaveClass('formItem', 'custom-form-item');
    });

    it('应该正确传递自定义style', () => {
      const customStyle = { marginTop: '20px', backgroundColor: 'red' };
      const { container } = render(
        <FormItem style={customStyle}>
          <div>测试内容</div>
        </FormItem>
      );

      const formItem = container.firstChild as HTMLElement;
      expect(formItem).toHaveStyle('margin-top: 20px');
      expect(formItem).toHaveStyle('background-color: red');
    });
  });

  // 子元素测试
  describe('子元素处理', () => {
    it('应该正确渲染单个子元素', () => {
      render(
        <FormItem>
          <button>测试按钮</button>
        </FormItem>
      );

      expect(screen.getByRole('button', { name: '测试按钮' })).toBeInTheDocument();
    });

    it('应该正确渲染多个子元素', () => {
      render(
        <FormItem>
          <label>测试标签</label>
          <input type="text" />
          <span>帮助文本</span>
        </FormItem>
      );

      expect(screen.getByText('测试标签')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByText('帮助文本')).toBeInTheDocument();
    });

    it('应该正确渲染复杂的子元素结构', () => {
      render(
        <FormItem>
          <div>
            <label htmlFor="test-input">复杂标签</label>
            <div>
              <input id="test-input" type="text" />
              <small>错误信息</small>
            </div>
          </div>
        </FormItem>
      );

      expect(screen.getByText('复杂标签')).toBeInTheDocument();
      expect(screen.getByLabelText('复杂标签')).toBeInTheDocument();
      expect(screen.getByText('错误信息')).toBeInTheDocument();
    });

    it('应该正确处理React组件作为子元素', () => {
      const TestComponent = () => <div data-testid="test-component">测试组件</div>;

      render(
        <FormItem>
          <TestComponent />
        </FormItem>
      );

      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
  });

  // 样式和属性测试
  describe('样式和属性', () => {
    it('应该使用默认的className空字符串', () => {
      const { container } = render(
        <FormItem>
          <div>测试</div>
        </FormItem>
      );

      const formItem = container.firstChild;
      expect(formItem).toHaveClass('formItem');
    });

    it('应该正确处理undefined的className', () => {
      const { container } = render(
        <FormItem className={undefined as any}>
          <div>测试</div>
        </FormItem>
      );

      const formItem = container.firstChild;
      expect(formItem).toHaveClass('formItem');
    });

    it('应该正确处理空字符串的className', () => {
      const { container } = render(
        <FormItem className="">
          <div>测试</div>
        </FormItem>
      );

      const formItem = container.firstChild;
      expect(formItem).toHaveClass('formItem');
    });

    it('应该正确处理undefined的style', () => {
      const { container } = render(
        <FormItem style={undefined as any}>
          <div>测试</div>
        </FormItem>
      );

      const formItem = container.firstChild;
      expect(formItem).toBeInTheDocument();
    });

    it('应该正确处理空对象style', () => {
      const { container } = render(
        <FormItem style={{}}>
          <div>测试</div>
        </FormItem>
      );

      const formItem = container.firstChild;
      expect(formItem).toBeInTheDocument();
    });

    it('应该同时应用className和style', () => {
      const customStyle = { padding: '10px' };
      const { container } = render(
        <FormItem className="test-class" style={customStyle}>
          <div>测试</div>
        </FormItem>
      );

      const formItem = container.firstChild as HTMLElement;
      expect(formItem).toHaveClass('formItem', 'test-class');
      expect(formItem).toHaveStyle('padding: 10px');
    });
  });

  // 实际使用场景测试
  describe('实际使用场景', () => {
    it('应该正确包装表单输入框', () => {
      render(
        <FormItem>
          <label htmlFor="username">用户名</label>
          <input id="username" type="text" />
        </FormItem>
      );

      expect(screen.getByText('用户名')).toBeInTheDocument();
      expect(screen.getByLabelText('用户名')).toBeInTheDocument();
    });

    it('应该正确包装复选框', () => {
      render(
        <FormItem>
          <label>
            <input type="checkbox" />
            同意条款
          </label>
        </FormItem>
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText('同意条款')).toBeInTheDocument();
    });

    it('应该正确包装下拉选择框', () => {
      render(
        <FormItem>
          <label htmlFor="country">国家</label>
          <select id="country">
            <option value="cn">中国</option>
            <option value="us">美国</option>
          </select>
        </FormItem>
      );

      expect(screen.getByText('国家')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('中国')).toBeInTheDocument();
      expect(screen.getByText('美国')).toBeInTheDocument();
    });

    it('应该正确包装文本域', () => {
      render(
        <FormItem>
          <label htmlFor="description">描述</label>
          <textarea id="description" rows={4} />
        </FormItem>
      );

      expect(screen.getByText('描述')).toBeInTheDocument();
      expect(screen.getByLabelText('描述')).toBeInTheDocument();
    });
  });

  // 边界情况测试
  describe('边界情况', () => {
    it('应该处理null子元素', () => {
      const { container } = render(
        <FormItem>
          {null}
        </FormItem>
      );

      const formItem = container.firstChild;
      expect(formItem).toBeInTheDocument();
      expect(formItem).toHaveClass('formItem');
    });

    it('应该处理undefined子元素', () => {
      const { container } = render(
        <FormItem>
          {undefined}
        </FormItem>
      );

      const formItem = container.firstChild;
      expect(formItem).toBeInTheDocument();
      expect(formItem).toHaveClass('formItem');
    });

    it('应该处理空字符串子元素', () => {
      const { container } = render(
        <FormItem>
          {''}
        </FormItem>
      );

      const formItem = container.firstChild;
      expect(formItem).toBeInTheDocument();
      expect(formItem).toHaveClass('formItem');
    });

    it('应该处理数字子元素', () => {
      render(
        <FormItem>
          {123}
        </FormItem>
      );

      expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('应该处理布尔值子元素', () => {
      const { container } = render(
        <FormItem>
          {true}
        </FormItem>
      );

      const formItem = container.firstChild;
      expect(formItem).toBeInTheDocument();
    });
  });

  // 可访问性测试
  describe('可访问性', () => {
    it('应该保持子元素的可访问性', () => {
      render(
        <FormItem>
          <label htmlFor="accessible-input">可访问输入</label>
          <input id="accessible-input" type="text" aria-describedby="help-text" />
          <small id="help-text">这是帮助文本</small>
        </FormItem>
      );

      const input = screen.getByLabelText('可访问输入');
      expect(input).toHaveAttribute('aria-describedby', 'help-text');
      expect(screen.getByText('这是帮助文本')).toBeInTheDocument();
    });

    it('应该保持表单元素的语义结构', () => {
      render(
        <FormItem>
          <fieldset>
            <legend>选择选项</legend>
            <label>
              <input type="radio" name="option" value="1" />
              选项1
            </label>
            <label>
              <input type="radio" name="option" value="2" />
              选项2
            </label>
          </fieldset>
        </FormItem>
      );

      expect(screen.getByText('选择选项')).toBeInTheDocument();
      expect(screen.getByRole('group')).toBeInTheDocument();
      expect(screen.getAllByRole('radio')).toHaveLength(2);
    });
  });

  // 性能相关测试
  describe('性能相关', () => {
    it('应该正确处理大量子元素', () => {
      const manyChildren = Array.from({ length: 100 }, (_, i) => (
        <div key={i}>子元素 {i + 1}</div>
      ));

      render(
        <FormItem>
          {manyChildren}
        </FormItem>
      );

      expect(screen.getByText('子元素 1')).toBeInTheDocument();
      expect(screen.getByText('子元素 100')).toBeInTheDocument();
    });

    it('应该正确处理动态子元素', () => {
      const items = ['项目1', '项目2', '项目3'];

      render(
        <FormItem>
          {items.map(item => (
            <div key={item}>{item}</div>
          ))}
        </FormItem>
      );

      expect(screen.getByText('项目1')).toBeInTheDocument();
      expect(screen.getByText('项目2')).toBeInTheDocument();
      expect(screen.getByText('项目3')).toBeInTheDocument();
    });
  });
});
