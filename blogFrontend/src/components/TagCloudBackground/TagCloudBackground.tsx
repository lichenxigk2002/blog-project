import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Book, Bookmark, FileText, Hash, Link, Paperclip, Type, Sparkles,
    Code, Terminal, Database, Server, Cpu, Layers, GitBranch,
    Github, GitPullRequest, GitCommit, GitMerge, GitFork,
    Code2, Brackets, Braces, FileCode,
    FileJson, FileType, FileArchive, FileImage,
    FileVideo, FileAudio, FileSpreadsheet, FileText as FileTextIcon,
    File, Folder, FolderOpen, FolderGit, FolderGit2,
    Search, Filter, Settings, Wrench,
    Palette, Paintbrush, PenTool, Pencil, Highlighter, Eraser,
    BookOpen, BookmarkCheck, BookmarkPlus, BookmarkX,
    Library, BookmarkMinus, BookmarkIcon, BookOpenCheck,
    LucideIcon
} from 'lucide-react';
import { TagsAPI } from '@/api/TagsAPI';
import { Tag } from "@/types/Tags";
import styles from './TagCloudBackground.module.scss';

interface TagItem {
    name: string;
    color?: string;
}

interface TagItemProps extends TagItem {
    icon: LucideIcon;
    isLeft: boolean;
    delay: number;
    index: number;
}

interface TagRowProps {
    isLeft: boolean;
    rowIndex: number;
    tags: TagItem[];
}

interface Row {
    isLeft: boolean;
    index: number;
}

interface TagCloudBackgroundProps {
    tags: TagItem[]; // 接收TagItem数组作为props
}

const icons: LucideIcon[] = [
    // 编程相关
    Code, Terminal, Database, Server, Cpu, Layers,
    Code2, Brackets, Braces,

    // Git相关
    GitBranch, Github, GitPullRequest, GitCommit, GitMerge, GitFork,

    // 文件相关
    FileCode, FileJson, FileType, FileArchive,
    FileImage, FileVideo, FileAudio, FileSpreadsheet, FileTextIcon,
    File, Folder, FolderOpen, FolderGit, FolderGit2,

    // 工具相关
    Search, Filter, Settings, Wrench,

    // 设计相关
    Palette, Paintbrush, PenTool, Pencil, Highlighter, Eraser,

    // 书籍相关
    Book, BookOpen, Bookmark, BookmarkCheck, BookmarkPlus,
    BookmarkX, Library, BookmarkMinus, BookmarkIcon, BookOpenCheck,

    // 其他
    Hash, Link, Paperclip, Type, Sparkles
];
const getRandomIcon = (): LucideIcon => icons[Math.floor(Math.random() * icons.length)];

// 添加默认标签
const defaultTag: TagItem = {
    name: "标签",
    color: "#666666"
};

const getRandomTag = (tags: TagItem[]): TagItem => {
    if (!tags || tags.length === 0) {
        return defaultTag;
    }
    return tags[Math.floor(Math.random() * tags.length)];
};

const TagItem: React.FC<TagItemProps> = ({ icon: Icon, isLeft, delay, name, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
            animate={{
                opacity: [0, 0.6, 0],
                x: isLeft ? [-50, 0, 50] : [50, 0, -50],
            }}
            transition={{
                duration: 8 + Math.random() * 4,
                delay: delay + index * 0.2,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'linear'
            }}
            className={styles.tagItem}
        >
            <div className={styles.badge}>
                <Icon size={14} style={{ color: 'var(--tag-color)' }} />
                <span>{name}</span>
            </div>
        </motion.div>
    );
};

const TagRow: React.FC<TagRowProps> = ({ isLeft, tags, rowIndex }) => {
    const rowTags = Array.from({ length: 6 }, (_, num) => {
        const randomTag = getRandomTag(tags);
        return {
            icon: getRandomIcon(),
            name: randomTag.name,
            color: randomTag.color,
            delay: num * 0.8 + rowIndex * 0.3,
            index: num
        };
    });

    return (
        <motion.div
            className={`${styles.row} ${isLeft ? styles.rowLeft : styles.rowRight}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: rowIndex * 0.2 }}
        >
            {rowTags.map((tag, index) => (
                <TagItem
                    key={`${index}-${rowIndex}`}
                    {...tag}
                    isLeft={isLeft}
                />
            ))}
        </motion.div>
    );
};

const TagCloudBackground: React.FC<TagCloudBackgroundProps> = ({ tags }) => {
    const [rows, setRows] = useState<Row[]>([]);

    useEffect(() => {
        const updateRows = () => {
            const numberOfRows = Math.ceil(window.innerHeight / 80);
            setRows(Array.from({ length: numberOfRows }, (_, i) => ({
                isLeft: i % 2 === 0,
                index: i
            })));
        };

        updateRows();
        window.addEventListener('resize', updateRows);
        return () => window.removeEventListener('resize', updateRows);
    }, []);

    return (
        <div className={styles.container}>
            {rows.map((row, index) => (
                <TagRow
                    key={index}
                    isLeft={row.isLeft}
                    rowIndex={row.index}
                    tags={tags}
                />
            ))}
        </div>
    );
};

export default TagCloudBackground;