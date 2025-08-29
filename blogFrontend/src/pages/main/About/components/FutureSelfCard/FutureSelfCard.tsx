import React from 'react';
import Galaxy from '@/components/Galaxy';
import styles from './FutureSelfCard.module.scss';

const FutureSelfCard: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundContainer}>
        <Galaxy
          density={1.2}
          starSpeed={0.2}
          hueShift={120}
          mouseInteraction={false}
          transparent={false}
          glowIntensity={0.4}
          saturation={0.3}
          twinkleIntensity={0.7}
          rotationSpeed={0.03}
          repulsionStrength={1.5}
          className="absolute inset-0"
        />
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.letterContent}>
          <h2 className={styles.title}>穿越星空的约定</h2>

          <div className={styles.letterBody}>
            <p>嗨，十年后的我：</p>

            <p>　　当你读到这段文字时，已经是2035年了。不知道那时的你，是否还记得2025年这个夏天的忐忑与期待？此刻的我，正坐在电脑前敲下这些字，刚刚结束大三的课程，准备踏入大四，一边投递前端实习简历，一边为秋招焦头烂额。</p>

            <p>　　现在的我，可能还在为一道 LeetCode 题抓耳挠腮，为某个框架的 API 文档熬夜啃读，或者因为一场技术面试紧张到失眠。但我想对你说：别笑当年的自己笨拙，因为每一步跌倒，都是你走到今天的垫脚石。</p>

            <p>　　十年后的你，是否已经成为了理想中的"前端架构师"？或者换了赛道，却依然热爱技术？无论答案是什么，我希望你记住：</p>

            <div className={styles.points}>
              <div className={styles.point}>
                <span className={styles.pointNumber}>1.</span>
                <div className={styles.pointContent}>
                  <strong>永远保持学习</strong><br />
                  前端的世界变得太快，但好奇心不该被时间磨平。如果2035年"前端"这个词还存在，记得回头看看2025年你学过的 React、Vue，它们或许像今天的 jQuery 一样成了"古董"，但正是这些碎片拼成了你的星辰大海。
                </div>
              </div>

              <div className={styles.point}>
                <span className={styles.pointNumber}>2.</span>
                <div className={styles.pointContent}>
                  <strong>珍惜那些"第一次"</strong><br />
                  你会记得人生第一份实习的 mentor 吗？第一次提交的垃圾代码、第一次线上事故、第一次涨薪的狂喜……这些琐碎的"新手村"记忆，会成为你最珍贵的源代码。
                </div>
              </div>

              <div className={styles.point}>
                <span className={styles.pointNumber}>3.</span>
                <div className={styles.pointContent}>
                  <strong>别忘记为什么出发</strong><br />
                  如果有一天你厌倦了，想想23岁的自己：那个为了一个动画效果调试到凌晨3点，却因为浏览器终于跑通而欢呼的年轻人。技术会过时，但解决问题的快乐永不褪色。
                </div>
              </div>
            </div>

            <p>　　最后，替我摸摸2035年的猫（你肯定养猫了吧？），看看窗外是不是已经有了飞行汽车（笑）。如果这十年里，你曾崩溃过、想放弃过，但最终挺过来了——那么，谢谢你的坚持。</p>

            <p className={styles.highlight}>　　约定好了：十年前的我负责勇敢，十年后的你负责骄傲。</p>

            <div className={styles.signature}>
              <p>2025年7月16日</p>
              <p>于某个通宵研究RTK的深夜</p>
              <p className={styles.ps}>（P.S. 如果现在你还没财富自由……记得提醒我早点买比特币！）</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureSelfCard; 