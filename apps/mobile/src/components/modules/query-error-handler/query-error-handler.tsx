import React from "react";
import { ActivityIndicator, View } from "react-native";
import { AlertCircle } from "lucide-react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";

import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export interface QueryErrorHandlerProps {
  refetch: () => void | Promise<unknown>;
  isFetching: boolean;
  title?: string;
  message?: string;
  retryLabel?: string;
  className?: string;
}

export const QueryErrorHandler = ({
  refetch,
  isFetching,
  title,
  message,
  retryLabel = "Try again",
  className,
}: QueryErrorHandlerProps) => {
  return (
    <View
      className={cn(
        "items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 px-8 py-10",
        className,
      )}
    >
      <VStack className="max-w-sm items-center gap-5">
        <Icon as={AlertCircle} size="2xl" className="text-amber-400" />
        <VStack className="items-center gap-2">
          <Text className="font-orbitron-semibold text-center text-lg uppercase tracking-tight text-zinc-100">
            {title ?? "Error"}
          </Text>
          <Text className="text-center text-sm leading-relaxed text-zinc-400">
            {message ?? "An error occurred while loading this content. Please try again."}
          </Text>
        </VStack>
        <Button
          action="primary"
          className="min-h-11 min-w-[160px] bg-amber-400"
          disabled={isFetching}
          onPress={() => void refetch()}
        >
          {isFetching ? (
            <ActivityIndicator size="small" color="#18181b" />
          ) : (
            <ButtonText className="font-semibold text-zinc-950">{retryLabel}</ButtonText>
          )}
        </Button>
      </VStack>
    </View>
  );
};
