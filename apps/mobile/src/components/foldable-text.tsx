import { View, Text } from "react-native";
import React, { useState } from "react";

import { useT } from "@/lib/i18n";
import { Button, ButtonText } from "@/components/ui/button";

type FoldableTextProps = {
  text: string;
  maxLines?: number;
};

export const FoldableText = ({ text, maxLines = 2 }: FoldableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const { t } = useT();

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
      <Text
        numberOfLines={isExpanded ? undefined : maxLines}
        className="text-sm leading-5 text-gray-600"
      >
        {text}
      </Text>
      {isTextTruncated && (
        <Button variant="link" onPress={() => setIsExpanded((prev) => !prev)}>
          <ButtonText className="my-0 py-0 text-2xs font-semibold uppercase text-zinc-500">
            {isExpanded ? t("showLess") : t("showMore")}
          </ButtonText>
        </Button>
      )}
    </View>
  );
};
