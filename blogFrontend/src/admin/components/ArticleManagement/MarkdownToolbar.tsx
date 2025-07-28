import React, { useState } from 'react';
import styles from './ArticleForm.module.scss';
import { FiTool } from "react-icons/fi";
import Modal from '../ui/Modal/Modal';
import Button from '../ui/Button/Button';

interface MarkdownToolbarProps {
  showToolbar: boolean;
  setShowToolbar: React.Dispatch<React.SetStateAction<boolean>>;
  insertAtCursor: (before: string, after?: string, options?: { multiLine?: boolean, indent?: number, outdent?: boolean, firstLineIndent?: boolean }) => void;
  handleImageUpload: () => void;
}

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({
  showToolbar,
  setShowToolbar,
  insertAtCursor,
  handleImageUpload
}) => {
  // 表格弹窗状态
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  // 插入自定义表格
  const handleInsertTable = () => {
    if (isNaN(rows) || isNaN(cols) || rows < 2 || cols < 1) return;
    let header = '|';
    let align = '|';
    let body = '';
    for (let c = 0; c < cols; c++) {
      header += ` 列${c + 1} |`;
      align += ' --- |';
    }
    for (let r = 1; r < rows; r++) {
      let row = '|';
      for (let c = 0; c < cols; c++) {
        row += ` 内容${r}${c + 1} |`;
      }
      body += row + '\n';
    }
    const table = `${header}\n${align}\n${body}`;
    insertAtCursor(table);
    setTableModalOpen(false);
    setShowToolbar(false);
  };

  // 有序/无序列表多行支持
  const handleList = (type: 'ul' | 'ol') => {
    insertAtCursor(type === 'ul' ? '- ' : '1. ', undefined, { multiLine: true });
    setShowToolbar(false);
  };

  // 增加缩进
  const handleIndent = () => {
    insertAtCursor('  ', undefined, { indent: 2 });
    setShowToolbar(false);
  };
  // 减少缩进
  const handleOutdent = () => {
    insertAtCursor('', undefined, { outdent: true });
    setShowToolbar(false);
  };
  // 首行缩进
  const handleFirstLineIndent = () => {
    insertAtCursor('  ', undefined, { firstLineIndent: true });
    setShowToolbar(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="primary"
        style={{ marginLeft: 8 }}
        onClick={() => setShowToolbar((v: boolean) => !v)}
        aria-label="Markdown 工具栏"
        icon={<FiTool size={15} />}
      />
      {showToolbar && (
        <div
          id="md-toolbar-popover"
          className={styles.toolbarPopover}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 40,
            padding: 16,
            minWidth: '340px'
          }}
        >
          {/* 标题等级 */}
          <div className={styles.toolbarSection}>
            <span className={styles.sectionLabel}>标题</span>
            <button className={styles.tagButton} onClick={() => { insertAtCursor('# '); setShowToolbar(false); }} title="一级标题">H1</button>
            <button className={styles.tagButton} onClick={() => { insertAtCursor('## '); setShowToolbar(false); }} title="二级标题">H2</button>
            <button className={styles.tagButton} onClick={() => { insertAtCursor('### '); setShowToolbar(false); }} title="三级标题">H3</button>
            <button className={styles.tagButton} onClick={() => { insertAtCursor('#### '); setShowToolbar(false); }} title="四级标题">H4</button>
          </div>

          {/* 文本格式 */}
          <div className={styles.toolbarSection}>
            <span className={styles.sectionLabel}>格式</span>
            <button className={styles.tagButton} onClick={() => { insertAtCursor('**', '**'); setShowToolbar(false); }} title="加粗"><b>B</b></button>
            <button className={styles.tagButton} onClick={() => { insertAtCursor('*', '*'); setShowToolbar(false); }} title="斜体"><i>I</i></button>
            <button className={styles.tagButton} onClick={() => { insertAtCursor('~~', '~~'); setShowToolbar(false); }} title="删除线"><s>S</s></button>
            <button className={styles.tagButton} onClick={() => { insertAtCursor('`', '`'); setShowToolbar(false); }} title="行内代码">{'</>'}</button>
          </div>

          {/* 列表和引用 */}
          <div className={styles.toolbarSection}>
            <span className={styles.sectionLabel}>列表</span>
            <button className={styles.tagButton} onClick={() => handleList('ul')} title="无序列表">•</button>
            <button className={styles.tagButton} onClick={() => handleList('ol')} title="有序列表">1.</button>
            <button className={styles.tagButton} onClick={() => { insertAtCursor('> '); setShowToolbar(false); }} title="引用">"</button>
          </div>

          {/* 缩进相关 */}
          <div className={styles.toolbarSection}>
            <span className={styles.sectionLabel}>缩进</span>
            <button className={styles.tagButton} onClick={handleIndent} title="增加缩进">⮞</button>
            <button className={styles.tagButton} onClick={handleOutdent} title="减少缩进">⮜</button>
            <button className={styles.tagButton} onClick={handleFirstLineIndent} title="首行缩进">⎵</button>
          </div>

          {/* 链接和媒体 */}
          <div className={styles.toolbarSection}>
            <span className={styles.sectionLabel}>媒体</span>
            <button className={styles.tagButton} onClick={() => { insertAtCursor('[链接文字](', ')'); setShowToolbar(false); }} title="链接">🔗</button>
            <button className={styles.tagButton} onClick={() => { handleImageUpload(); setShowToolbar(false); }} title="插入图片">🖼️</button>
          </div>

          {/* 代码块和表格 */}
          <div className={styles.toolbarSection}>
            <span className={styles.sectionLabel}>高级</span>
            <button className={styles.tagButton} onClick={() => { insertAtCursor('```\n', '\n```'); setShowToolbar(false); }} title="代码块">{'{}'}</button>
            <button type="button" className={styles.tagButton} onClick={e => { e.preventDefault(); setTableModalOpen(true); }} title="插入表格">📊</button>
            <button className={styles.tagButton} onClick={() => { insertAtCursor('---'); setShowToolbar(false); }} title="分割线">—</button>
          </div>
        </div>
      )}
      {/* 表格插入弹窗 */}
      <Modal
        open={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        footer={
          <>
            <Button type="button" onClick={() => setTableModalOpen(false)}>取消</Button>
            <Button type="button" variant="primary" onClick={e => { e.preventDefault(); e.stopPropagation(); handleInsertTable(); }}>插入</Button>
          </>
        }
        width={500}
      >
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', marginBottom: 8 }}>
          <div>
            <label style={{ color: '#6c3ec1', fontWeight: 600, fontSize: 15, display: 'block' }}>
              行数
              <input
                type="number"
                min={2}
                value={rows}
                onChange={e => setRows(Number(e.target.value))}
                className={styles.modalInput}
              />
            </label>
          </div>
          <div>
            <label style={{ color: '#6c3ec1', fontWeight: 600, fontSize: 15, display: 'block' }}>
              列数
              <input
                type="number"
                min={1}
                value={cols}
                onChange={e => setCols(Number(e.target.value))}
                className={styles.modalInput}
              />
            </label>
          </div>
        </div>
        <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>至少2行（含表头），1列</div>
      </Modal>
    </>
  );
};

export default MarkdownToolbar; 