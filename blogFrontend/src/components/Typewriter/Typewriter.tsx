import React, {useState,useEffect} from "react";
import styles from './Typewriter.module.scss'
import TyperwriterProps from '../../types/Typewriter'


/*定义组件接口类型*/

 const Typerwriter:React.FC<TyperwriterProps> = ({text,delay=300,className,cursorChar = "_"}) => {

    /*定义三个核心状态*/
    const [currentText,setCurrentText] = useState('');/*当前显示的文本*/
    const [currentIndex,setCurrentIndex] = useState(0);/*当前字符的索引*/
    const [isCompleted,setIsCompleted] = useState(false);/*完成状态的标志*/

     useEffect(() => {
         /*当text变化时重置所有状态*/
         setCurrentText('');
         setCurrentIndex(0);
         setIsCompleted(false);
     },[text]/*text文本内容*/)
     useEffect(() => {
         if(currentIndex >= text.length){
             setIsCompleted(true);/*标记为完成状态*/
             return; /*退出*/
         }
         /*这是定时器，按照指定间隔来追加字符*/
         const timer = setTimeout(() => {
             setCurrentText(prev => prev + text[currentIndex]);/*根据索引追加文字内容*/
             setCurrentIndex(prev => prev + 1);/*更新索引*/
         },delay)
         return () => clearTimeout(timer)/*这是清理函数，组件卸载或依赖变化时清除定时器*/
     }, [currentIndex,text,delay]);

     return (
         /*<div className={`${className}`} >
             {currentText}
             {!isCompleted &&(
                 <span >{cursorChar}</span>
             )}
         </div>*/
         <div className={`${className} ${styles.typewriter}`}>
             {currentText}
             {!isCompleted && (
                 <span className={styles.cursor}>{cursorChar}</span>
             )}
         </div>
     )
}
export default Typerwriter;