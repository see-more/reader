import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 防抖 Hook - 防止频繁触发
 * @param value 需要防抖的值
 * @param delay 延迟时间（毫秒）
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 节流 Hook - 限制函数执行频率
 * @param callback 需要节流的回调
 * @param delay 延迟时间（毫秒）
 */
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): T {
  const lastRun = useRef(Date.now());

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, delay],
  ) as T;

  return throttledCallback;
}

/**
 * 使用优化的状态更新 - 类似 useCallback 但返回新状态
 * @param initialState 初始状态
 */
export function useOptimizedState<T>(initialState: T): [T, (updater: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);

  const optimizedSetState = useCallback((updater: T | ((prev: T) => T)) => {
    setState((prev) => {
      if (typeof updater === 'function') {
        return (updater as (prev: T) => T)(prev);
      }
      return updater;
    });
  }, []);

  return [state, optimizedSetState];
}
