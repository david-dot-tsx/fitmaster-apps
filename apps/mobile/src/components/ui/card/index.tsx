import React from "react";
import { cn, type VariantProps } from "@gluestack-ui/utils/nativewind-utils";
import { View, type ViewProps } from "react-native";

import { cardStyle } from "./styles";

type ICardProps = ViewProps & VariantProps<typeof cardStyle> & { className?: string };

const Card = React.forwardRef<React.ComponentRef<typeof View>, ICardProps>(function Card(
  { className, size = "md", variant = "elevated", ...props },
  ref,
) {
  return (
    <View
      className={cardStyle({
        size,
        variant,
        class: cn("bg-zinc-950/50 backdrop-blur-md", className),
      })}
      {...props}
      ref={ref}
    />
  );
});

Card.displayName = "Card";

export { Card };
