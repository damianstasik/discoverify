import { useCallback, useEffect } from 'react';
import { atomFamily, useRecoilState } from 'recoil';

const timerAtom = atomFamily<
  {
    time: number;
    status: 'STOPPED' | 'RUNNING' | 'PAUSED';
  },
  string
>({
  key: 'timer',
  default: {
    time: 0,
    status: 'STOPPED',
  },
});

export function useTimer(name: string) {
  const [timer, setTimer] = useRecoilState(timerAtom(name));

  const set = useCallback((time) => {
    setTimer((t) => ({ ...t, time }));
  }, []);

  const pause = useCallback(() => {
    setTimer((t) => ({ ...t, status: 'PAUSED' }));
  }, []);

  const reset = useCallback(() => {
    setTimer({ time: 0, status: 'STOPPED' });
  }, []);

  const start = useCallback(() => {
    setTimer((t) => ({
      time: t.status === 'STOPPED' ? 0 : t.time,
      status: 'RUNNING',
    }));
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (timer.status === 'RUNNING') {
      intervalId = setInterval(() => set(timer.time + 1), 1000);
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timer]);

  return {
    set,
    pause,
    reset,
    start,
    time: timer.time,
    status: timer.status,
  };
}
