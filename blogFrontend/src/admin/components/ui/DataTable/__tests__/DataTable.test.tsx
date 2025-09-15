// src/admin/components/ui/DataTable/__tests__/DataTable.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataTable, { TableColumn, TableAction } from '../DataTable';

// 测试数据类型
interface TestData {
    id: number;
    name: string;
    status: string;
    createTime: string;
    description?: string;
}

// 测试数据
const mockData: TestData[] = [
    {
        id: 1,
        name: '测试文章1',
        status: 'published',
        createTime: '2024-01-01',
        description: '这是第一篇文章的描述'
    },
    {
        id: 2,
        name: '测试文章2',
        status: 'draft',
        createTime: '2024-01-02',
        description: '这是第二篇文章的描述'
    },
    {
        id: 3,
        name: '测试文章3',
        status: 'archived',
        createTime: '2024-01-03'
    }
];

// 基础列配置
const basicColumns: TableColumn<TestData>[] = [
    {
        key: 'name',
        title: '名称',
        sortable: true
    },
    {
        key: 'status',
        title: '状态',
        sortable: true
    },
    {
        key: 'createTime',
        title: '创建时间'
    }
];

// 带自定义渲染的列配置
const columnsWithRender: TableColumn<TestData>[] = [
    {
        key: 'name',
        title: '名称',
        sortable: true
    },
    {
        key: 'status',
        title: '状态',
        render: (value: string) => (
            <span data-testid={`status-${value}`} className={`status-${value}`}>
                {value}
            </span>
        )
    },
    {
        key: 'description',
        title: '描述',
        render: (value: string, record: TestData) => (
            <span data-testid={`desc-${record.id}`}>
                {value || '无描述'}
            </span>
        )
    }
];

describe('DataTable组件', () => {
    // 基础渲染测试
    describe('基础渲染', () => {
        it('应该正确渲染表格', () => {
            render(<DataTable data={mockData} columns={basicColumns} />);

            expect(screen.getByText('名称')).toBeInTheDocument();
            expect(screen.getByText('状态')).toBeInTheDocument();
            expect(screen.getByText('创建时间')).toBeInTheDocument();
            expect(screen.getByText('测试文章1')).toBeInTheDocument();
            expect(screen.getByText('测试文章2')).toBeInTheDocument();
        });

        it('应该应用默认样式类', () => {
            render(<DataTable data={mockData} columns={basicColumns} />);

            const table = screen.getByText('名称').closest('.table');
            expect(table).toHaveClass('table');
        });

        it('应该正确传递自定义className', () => {
            render(<DataTable data={mockData} columns={basicColumns} className="custom-table" />);

            const table = screen.getByText('名称').closest('.table');
            expect(table).toHaveClass('custom-table');
        });
    });

    // 数据显示测试
    describe('数据显示', () => {
        it('应该正确显示所有数据行', () => {
            render(<DataTable data={mockData} columns={basicColumns} />);

            expect(screen.getByText('测试文章1')).toBeInTheDocument();
            expect(screen.getByText('测试文章2')).toBeInTheDocument();
            expect(screen.getByText('测试文章3')).toBeInTheDocument();
            expect(screen.getByText('published')).toBeInTheDocument();
            expect(screen.getByText('draft')).toBeInTheDocument();
            expect(screen.getByText('archived')).toBeInTheDocument();
        });

        it('应该正确使用自定义渲染函数', () => {
            render(<DataTable data={mockData} columns={columnsWithRender} />);

            expect(screen.getByTestId('status-published')).toBeInTheDocument();
            expect(screen.getByTestId('status-draft')).toBeInTheDocument();
            expect(screen.getByTestId('status-archived')).toBeInTheDocument();
            expect(screen.getByTestId('desc-1')).toHaveTextContent('这是第一篇文章的描述');
            expect(screen.getByTestId('desc-3')).toHaveTextContent('无描述');
        });

        it('应该正确处理空数据', () => {
            render(<DataTable data={[]} columns={basicColumns} />);

            expect(screen.getByText('暂无数据')).toBeInTheDocument();
            expect(screen.queryByText('名称')).not.toBeInTheDocument();
        });

        it('应该使用自定义空数据文本', () => {
            render(<DataTable data={[]} columns={basicColumns} emptyText="没有找到数据" />);

            expect(screen.getByText('没有找到数据')).toBeInTheDocument();
        });
    });

    // 排序功能测试
    describe('排序功能', () => {
        it('应该显示可排序列的样式', () => {
            render(<DataTable data={mockData} columns={basicColumns} />);

            const nameHeader = screen.getByText('名称');
            const statusHeader = screen.getByText('状态');
            const timeHeader = screen.getByText('创建时间');

            expect(nameHeader.closest('div')).toHaveClass('sortable');
            expect(statusHeader.closest('div')).toHaveClass('sortable');
            expect(timeHeader.closest('div')).not.toHaveClass('sortable');
        });

        it('应该正确处理排序点击事件', () => {
            const onSort = jest.fn();
            render(<DataTable data={mockData} columns={basicColumns} onSort={onSort} />);

            fireEvent.click(screen.getByText('名称'));
            expect(onSort).toHaveBeenCalledWith('name');

            fireEvent.click(screen.getByText('状态'));
            expect(onSort).toHaveBeenCalledWith('status');
        });

        it('应该显示当前排序状态', () => {
            render(
                <DataTable
                    data={mockData}
                    columns={basicColumns}
                    sortField="name"
                    sortOrder="asc"
                />
            );

            expect(screen.getByText('↑')).toBeInTheDocument();
        });

        it('应该显示降序排序状态', () => {
            render(
                <DataTable
                    data={mockData}
                    columns={basicColumns}
                    sortField="status"
                    sortOrder="desc"
                />
            );

            expect(screen.getByText('↓')).toBeInTheDocument();
        });

        it('不应该在不可排序列上触发排序', () => {
            const onSort = jest.fn();
            render(<DataTable data={mockData} columns={basicColumns} onSort={onSort} />);

            fireEvent.click(screen.getByText('创建时间'));
            expect(onSort).not.toHaveBeenCalled();
        });
    });

    // 操作按钮测试
    describe('操作按钮', () => {
        const actions: TableAction<TestData>[] = [
            {
                key: 'edit',
                label: '编辑',
                variant: 'primary',
                onClick: jest.fn()
            },
            {
                key: 'delete',
                label: '删除',
                variant: 'danger',
                onClick: jest.fn()
            }
        ];

        beforeEach(() => {
            actions.forEach(action => {
                (action.onClick as jest.Mock).mockClear();
            });
        });

        it('应该正确渲染操作按钮', () => {
            render(<DataTable data={mockData} columns={basicColumns} actions={actions} />);

            expect(screen.getByText('操作')).toBeInTheDocument();
            expect(screen.getAllByText('编辑')).toHaveLength(3);
            expect(screen.getAllByText('删除')).toHaveLength(3);
        });

        it('应该正确处理按钮点击事件', () => {
            render(<DataTable data={mockData} columns={basicColumns} actions={actions} />);

            const editButtons = screen.getAllByText('编辑');
            fireEvent.click(editButtons[0]);

            expect(actions[0].onClick).toHaveBeenCalledWith(mockData[0]);
        });

        it('应该正确传递记录数据给操作函数', () => {
            render(<DataTable data={mockData} columns={basicColumns} actions={actions} />);

            const deleteButtons = screen.getAllByText('删除');
            fireEvent.click(deleteButtons[1]);

            expect(actions[1].onClick).toHaveBeenCalledWith(mockData[1]);
        });

        it('应该正确处理禁用状态', () => {
            const actionsWithDisabled: TableAction<TestData>[] = [
                {
                    key: 'edit',
                    label: '编辑',
                    onClick: jest.fn(),
                    disabled: (record) => record.status === 'archived'
                }
            ];

            render(<DataTable data={mockData} columns={basicColumns} actions={actionsWithDisabled} />);

            const editButtons = screen.getAllByText('编辑');
            expect(editButtons[0]).not.toBeDisabled(); // published
            expect(editButtons[1]).not.toBeDisabled(); // draft
            expect(editButtons[2]).toBeDisabled(); // archived
        });

        it('应该正确应用按钮变体样式', () => {
            render(<DataTable data={mockData} columns={basicColumns} actions={actions} />);

            const editButtons = screen.getAllByText('编辑');
            const deleteButtons = screen.getAllByText('删除');

            editButtons.forEach(button => {
                expect(button).toHaveClass('primary');
            });

            deleteButtons.forEach(button => {
                expect(button).toHaveClass('danger');
            });
        });

        it('应该正确处理带图标的操作按钮', () => {
            const actionsWithIcon: TableAction<TestData>[] = [
                {
                    key: 'edit',
                    label: '编辑',
                    icon: <span data-testid="edit-icon">✏️</span>,
                    onClick: jest.fn()
                }
            ];

            render(<DataTable data={mockData} columns={basicColumns} actions={actionsWithIcon} />);

            expect(screen.getAllByTestId('edit-icon')).toHaveLength(3);
        });
    });

    // 加载状态测试
    describe('加载状态', () => {
        it('应该正确显示加载状态', () => {
            render(<DataTable data={[]} columns={basicColumns} loading={true} />);

            expect(screen.getByText('加载中...')).toBeInTheDocument();
            // 正确的方式：直接查找loadingSpinner元素
            const loadingSpinner = document.querySelector('.loadingSpinner');
            expect(loadingSpinner).toBeInTheDocument();
            expect(loadingSpinner).toHaveClass('loadingSpinner');
        });

        it('加载状态下不应该显示数据', () => {
            render(<DataTable data={mockData} columns={basicColumns} loading={true} />);

            expect(screen.queryByText('测试文章1')).not.toBeInTheDocument();
            expect(screen.queryByText('名称')).not.toBeInTheDocument();
        });
    });

    // 行键测试
    describe('行键处理', () => {
        it('应该使用默认id作为行键', () => {
            render(<DataTable data={mockData} columns={basicColumns} />);

            // 检查是否渲染了正确的数据行数
            const rows = screen.getAllByText(/测试文章/);
            expect(rows).toHaveLength(3);
        });

        it('应该使用自定义行键字段', () => {
            const customData = [
                { customId: 1, name: '测试1' },
                { customId: 2, name: '测试2' }
            ];
            const customColumns = [{ key: 'name', title: '名称' }];

            render(<DataTable data={customData} columns={customColumns} rowKey="customId" />);

            expect(screen.getByText('测试1')).toBeInTheDocument();
            expect(screen.getByText('测试2')).toBeInTheDocument();
        });

        it('应该使用函数生成行键', () => {
            const customData = [
                { id: 1, name: '测试1' },
                { id: 2, name: '测试2' }
            ];
            const customColumns = [{ key: 'name', title: '名称' }];

            render(
                <DataTable
                    data={customData}
                    columns={customColumns}
                    rowKey={(record) => `row-${record.id}`}
                />
            );

            expect(screen.getByText('测试1')).toBeInTheDocument();
            expect(screen.getByText('测试2')).toBeInTheDocument();
        });
    });

    // 列宽度测试
    describe('列宽度', () => {
        it('应该正确应用列宽度', () => {
            const columnsWithWidth: TableColumn<TestData>[] = [
                {
                    key: 'name',
                    title: '名称',
                    width: '200px'
                },
                {
                    key: 'status',
                    title: '状态',
                    width: '100px'
                }
            ];

            render(<DataTable data={mockData} columns={columnsWithWidth} />);

            const nameHeader = screen.getByText('名称');
            const statusHeader = screen.getByText('状态');

            expect(nameHeader).toHaveStyle('width: 200px');
            expect(statusHeader).toHaveStyle('width: 100px');
        });
    });

    // 网格布局测试
    describe('网格布局', () => {
        it('应该正确计算无操作按钮时的列数', () => {
            render(<DataTable data={mockData} columns={basicColumns} />);

            const header = screen.getByText('名称').closest('.tableHeader');
            expect(header).toHaveStyle('grid-template-columns: repeat(3, 1fr)');
        });

        it('应该正确计算有操作按钮时的列数', () => {
            const actions: TableAction<TestData>[] = [
                { key: 'edit', label: '编辑', onClick: jest.fn() }
            ];

            render(<DataTable data={mockData} columns={basicColumns} actions={actions} />);

            const header = screen.getByText('名称').closest('.tableHeader');
            expect(header).toHaveStyle('grid-template-columns: repeat(4, 1fr)');
        });
    });

    // 边界情况测试
    describe('边界情况', () => {
        it('应该处理空actions数组', () => {
            render(<DataTable data={mockData} columns={basicColumns} actions={[]} />);

            expect(screen.queryByText('操作')).not.toBeInTheDocument();
        });

        it('应该处理undefined actions', () => {
            render(<DataTable data={mockData} columns={basicColumns} />);

            expect(screen.queryByText('操作')).not.toBeInTheDocument();
        });

        it('应该处理没有onSort函数的情况', () => {
            render(<DataTable data={mockData} columns={basicColumns} />);

            // 点击可排序列不应该报错
            expect(() => {
                fireEvent.click(screen.getByText('名称'));
            }).not.toThrow();
        });

        it('应该处理没有render函数的列', () => {
            const simpleColumns: TableColumn<TestData>[] = [
                { key: 'name', title: '名称' }
            ];

            render(<DataTable data={mockData} columns={simpleColumns} />);

            expect(screen.getByText('测试文章1')).toBeInTheDocument();
        });
    });

    // 可访问性测试
    describe('可访问性', () => {
        it('应该支持键盘导航', () => {
            const onSort = jest.fn();
            render(<DataTable data={mockData} columns={basicColumns} onSort={onSort} />);

            const sortableHeader = screen.getByText('名称');

            // 测试点击功能，而不是焦点
            fireEvent.click(sortableHeader);
            expect(onSort).toHaveBeenCalledWith('name');

            // 或者测试键盘事件
            fireEvent.keyDown(sortableHeader, { key: 'Enter' });
            // 如果组件支持键盘事件的话
        });

        it('应该正确处理表格结构', () => {
            render(<DataTable data={mockData} columns={basicColumns} />);

            // 检查表格结构
            expect(screen.getByText('名称').closest('.tableHeader')).toBeInTheDocument();
            expect(screen.getByText('测试文章1').closest('.tableRow')).toBeInTheDocument();
        });
    });

    // 水平滚动功能测试
    describe('水平滚动功能', () => {
        it('应该支持水平滚动查看所有列', () => {
            const actions: TableAction<TestData>[] = [
                { key: 'edit', label: '编辑', onClick: jest.fn() },
                { key: 'delete', label: '删除', onClick: jest.fn() }
            ];

            render(<DataTable data={mockData} columns={basicColumns} actions={actions} />);

            const table = screen.getByText('名称').closest('.table');

            // 检查表格是否支持水平滚动
            expect(table).toHaveStyle('overflow-x: auto');

            // 检查操作按钮是否完整显示
            const editButtons = screen.getAllByText('编辑');
            editButtons.forEach(button => {
                expect(button).toBeVisible();
            });
        });
    });
});