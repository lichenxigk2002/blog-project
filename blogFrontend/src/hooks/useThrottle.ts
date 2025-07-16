import { useRef, useCallback } from 'react';

/**
 * 节流 Hook：返回一个节流后的函数
 * @param fn 需要节流的函数
 * @param delay 节流间隔（毫秒）
 */
export function useThrottle<T extends (...args: any[]) => any>(fn: T, delay: number): T {
    const lastCall = useRef(0);

    return useCallback((...args: any[]) => {
        const now = Date.now();
        if (now - lastCall.current >= delay) {
            lastCall.current = now;
            fn(...args);
        }
    }, [fn, delay]) as T;
}

// function throttle(fn, delay) {
//     let lastCall = 0;
//     return function (...args) {
//         const now = Date.now();
//         if (now - lastCall >= delay) {
//             lastCall = now;
//             fn.apply(this, args);
//         }
//     };
// }