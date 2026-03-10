import { View, Text } from "react-native";
import React, { useState } from "react";

import { Button, ButtonText } from "@/components/ui/button";

type FoldableTextProps = {
  label: string;
  text: string;
  maxLines?: number;
};

export const FoldableText = ({ label, text, maxLines = 2 }: FoldableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);

  return (
    <View className="relative">
      {/* Hidden text used only to measure the real line count */}
      <Text
        className="absolute -z-10 opacity-0"
        onTextLayout={(e) => {
          setIsTextTruncated(e.nativeEvent.lines.length > maxLines);
        }}
      >
        {text}
      </Text>
      <Text className="mb-1 text-sm font-semibold capitalize text-amber-400">{label}</Text>
      <Text
        numberOfLines={isExpanded ? undefined : maxLines}
        className="text-sm leading-5 text-gray-600"
      >
        {text}
      </Text>
      {isTextTruncated && (
        <Button variant="link" onPress={() => setIsExpanded((prev) => !prev)}>
          <ButtonText className="my-0 py-0 text-sm font-semibold text-zinc-500">
            {isExpanded ? "Show less" : "Show more"}
          </ButtonText>
        </Button>
      )}
    </View>
  );
};
