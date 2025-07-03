import React, { useState, useImperativeHandle, forwardRef } from 'react';
import styles from './FlipCard.module.scss';

export interface FlipCardHandleInterface {
  flipDown: (newFrontText: string | number, newBackText: string | number) => void;
  flipUp: (newFrontText: string | number, newBackText: string | number) => void;
}

export interface FlipCardPropsInterface {
  initFrontText?: string | number;
  initBackText?: string | number;
  duration?: number;
}

const FlipCard = (
  {
    initFrontText = '0',
    initBackText = '1',
    duration = 600,
  }: FlipCardPropsInterface,
  ref: React.Ref<FlipCardHandleInterface>
) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipType, setFlipType] = useState('down');
  const [frontText, setFrontText] = useState(initFrontText);
  const [backText, setBackText] = useState(initBackText);

  const flip = ({
    type,
    newFrontText,
    newBackText,
  }: {
    type: string;
    newFrontText: string | number;
    newBackText: string | number;
  }) => {
    if (isFlipping) return false;
    setFrontText(newFrontText);
    setBackText(newBackText);
    setFlipType(type);
    setIsFlipping(true);

    setTimeout(() => {
      setFrontText(newBackText);
      setIsFlipping(false);
    }, duration);
  };

  useImperativeHandle(ref, () => ({
    flipDown: (newFrontText: string | number, newBackText: string | number) => {
      flip({ type: 'down', newFrontText, newBackText });
    },
    flipUp: (newFrontText: string | number, newBackText: string | number) => {
      flip({ type: 'up', newFrontText, newBackText });
    },
  }));

  return (
    <div className={`${styles.flipCard} ${styles[flipType]} ${isFlipping ? styles.go : ''}`}>
      <div className={`${styles.digital} ${styles.front} ${styles['number' + frontText]}`}></div>
      <div className={`${styles.digital} ${styles.back} ${styles['number' + backText]}`}></div>
    </div>
  );
};

export default forwardRef<FlipCardHandleInterface, FlipCardPropsInterface>(FlipCard);