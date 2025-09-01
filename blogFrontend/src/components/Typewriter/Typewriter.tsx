import React, {useState,useEffect} from "react";
import styles from './Typewriter.module.scss'
import TyperwriterProps from '../../types/Typewriter'


/*定义组件接口类型*/

 const Typerwriter:React.FC<TyperwriterProps> = ({
                                                     text,
                                                     delay=300,
                                                     className,
                                                     cursorChar = "_",
                                                     indentFirstLine = false,
                                                     indentSize = 2
 }) => {

    /*定义三个核心状态*/
    const [currentText,setCurrentText] = useState('');/*当前显示的文本*/
    const [currentIndex,setCurrentIndex] = useState(0);/*当前字符的索引*/
    const [isCompleted,setIsCompleted] = useState(false);/*完成状态的标志*/
     const [hasIndented, setHasIndented] = useState(false);

     useEffect(() => {
         /*当text变化时重置所有状态*/
         setCurrentText('');
         setCurrentIndex(0);
         setIsCompleted(false);
         setHasIndented(false);
     },[text]/*text文本内容*/)
     useEffect(() => {
         if(currentIndex >= text.length){
             setIsCompleted(true);/*标记为完成状态*/
             return; /*退出*/
         }
         /*这是定时器，按照指定间隔来追加字符*/
         const timer = setTimeout(() => {
             let nextChar = text[currentIndex];

             // 只有当 indentFirstLine 为 true 时才添加缩进
             if (indentFirstLine && !hasIndented && currentIndex === 0) {
                 const indentSpaces = '&nbsp;'.repeat(indentSize);
                 setCurrentText(indentSpaces);
                 setHasIndented(true);
             }
             else if (nextChar === '\n') {
                 setCurrentText(prev => prev + '<br />');
             }
             else {
                 setCurrentText(prev => prev + nextChar);
             }

             setCurrentIndex(prev => prev + 1);
         }, delay);

         return () => clearTimeout(timer)/*这是清理函数，组件卸载或依赖变化时清除定时器*/
     }, [currentIndex, text, delay, indentFirstLine, indentSize, hasIndented]);

     return (
         /*<div className={`${className}`} >
             {currentText}
             {!isCompleted &&(
                 <span >{cursorChar}</span>
             )}
         </div>*/
         <div
             className={`${className} ${styles.typewriter}`}
             dangerouslySetInnerHTML={{
                 __html: currentText + (isCompleted ? '' : `<span class="${styles.cursor}">${cursorChar}</span>`)
             }}
         />
     )
}
export default Typerwriter;