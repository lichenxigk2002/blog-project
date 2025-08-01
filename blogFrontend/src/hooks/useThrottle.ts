import { useState, useEffect, useRef } from 'react';

export function useThrottle<T>(value: T, delay: number): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastExecuted = useRef<number>(0);

    useEffect(() => {
        const now = Date.now();

        if (now - lastExecuted.current >= delay) {
            // 如果距离上次执行已经超过延迟时间，立即执行
            setThrottledValue(value);
            lastExecuted.current = now;
        } else {
            // 否则设置定时器，在剩余时间后执行
            const timer = setTimeout(() => {
                setThrottledValue(value);
                lastExecuted.current = Date.now();
            }, delay - (now - lastExecuted.current));

            return () => {
                clearTimeout(timer);
            };
        }
    }, [value, delay]);

    return throttledValue;
}