import React, {useEffect, useRef} from 'react';

const CodeRain: React.FC = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if(!canvasRef.current) return;

        const canvas = canvasRef.current;

        const width = window.innerWidth * window.devicePixelRatio;
        const height = window.innerHeight * window.devicePixelRatio;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const fontSize = 20 * window.devicePixelRatio;

        const columnWidth = fontSize;

        const columnCount = Math.floor(width / columnWidth)

        const nextChars = Array.from({ length: columnCount }, () => Math.floor(Math.random() * (height / fontSize)));

        const getRandomColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        const getRandomChar = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            return chars[Math.floor(Math.random() * chars.length)];
        }

        const draw = () => {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0,0,0,0.1)'; // 透明度越高，拖尾越短
            ctx.fillRect(0, 0, width, height);

            ctx.globalCompositeOperation = 'source-over';
            for (let i = 0; i < columnCount; i++) {
                const char = getRandomChar();
                const color = getRandomColor();
                const x = i * columnWidth;
                const y = nextChars[i] * fontSize;

                ctx.textBaseline = 'top';
                ctx.fillStyle = color;
                ctx.font = `${fontSize}px Roboto Mono`;
                ctx.fillText(char, x, y);

                if (y > height && Math.random() > 0.975) {
                    nextChars[i] = 0;
                } else {
                    nextChars[i]++;
                }
            }
        }

        const intervalId = setInterval(draw, 50);

        return () => clearInterval(intervalId);
    }, []);



    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
            }}
        >

        </canvas>
    );
};

export default CodeRain;