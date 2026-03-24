import { View, Text } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { PauseIcon, PlayIcon, SquareIcon } from "lucide-react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { Button, ButtonIcon } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";

interface StopWatchProps {
  elapsed: number;
  running: boolean;
  setElapsed: (elapsed: number) => void;
  setRunning: (running: boolean) => void;
  resetStopWatch: () => void;
  toggleStopWatch: () => void;
}

export const StopWatch = ({
  elapsed,
  running,
  setElapsed,
  setRunning,
  resetStopWatch,
  toggleStopWatch,
  disabled,
}: StopWatchProps & { disabled?: boolean }) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now() - elapsed;
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [elapsed, running, setElapsed, setRunning]);

  const format = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
  };

  return (
    <VStack className="flex flex-col items-center justify-center gap-4 py-8">
      <Text className="text-center text-6xl font-bold tabular-nums text-white">
        {format(elapsed)}
      </Text>
      <View className="flex flex-row gap-4">
        <Button
          size="lg"
          variant="outline"
          onPress={toggleStopWatch}
          className={cn("border-0 border-none bg-amber-400/10", { "opacity-0": disabled })}
        >
          <ButtonIcon as={running ? PauseIcon : PlayIcon} className="text-amber-400" />
        </Button>
        <Button
          disabled={disabled}
          size="lg"
          variant="outline"
          onPress={resetStopWatch}
          className={cn("bg-error-500/10 border-0 border-none", { "opacity-0": disabled })}
        >
          <ButtonIcon as={SquareIcon} className="text-error-500" />
        </Button>
      </View>
    </VStack>
  );
};

export const useStopWatch = (): StopWatchProps => {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  return {
    elapsed,
    running,
    setElapsed,
    setRunning,
    resetStopWatch: () => {
      setElapsed(0);
      setRunning(false);
    },
    toggleStopWatch: () => setRunning((prev) => !prev),
  };
};
