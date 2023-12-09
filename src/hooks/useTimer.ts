import { useCallback, useEffect, useState } from "react";
// import { atomFamily, useRecoilState } from "recoil";

interface Timer {
  time: number;
  status: "STOPPED" | "RUNNING" | "PAUSED";
}
export function useTimer() {
  const [timer, setTimer] = useState<Timer>({
    time: 0,
    status: "STOPPED",
  });

  const set = useCallback(
    (time) => {
      setTimer((t) => ({ ...t, time }));
    },
    [setTimer],
  );

  const pause = useCallback(() => {
    setTimer((t) => ({ ...t, status: "PAUSED" }));
  }, [setTimer]);

  const reset = useCallback(() => {
    setTimer({ time: 0, status: "STOPPED" });
  }, [setTimer]);

  const start = useCallback(() => {
    setTimer((t) => ({
      time: t.status === "STOPPED" ? 0 : t.time,
      status: "RUNNING",
    }));
  }, [setTimer]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (timer.status === "RUNNING") {
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
