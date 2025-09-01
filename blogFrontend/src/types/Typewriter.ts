export default interface TyperwriterProps {
    text: string;// 要显示的文本
    delay?: number;// 每个字符显示的延迟时间，单位毫秒，默认 100
    className?: string; // 组件的类名
    cursorChar?: string;// 光标字符，默认 '|'
    indentFirstLine?: boolean; // 是否首行缩进，默认 false
    indentSize?: number; // 缩进大小（字符数），默认 2
}