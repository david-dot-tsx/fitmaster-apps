"use client";
import React from "react";
import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";
interface ImageCellProps extends ImageProps {
  classNames?: {
    image?: string;
    container?: string;
  };
}
export const ImageCell = ({
  classNames = {},
  width = 54,
  height = 54,
  ...props
}: ImageCellProps) => {
  return (
    <div className={cn("mx-auto", classNames.container)} style={{ width, height }}>
      <Image
        className={cn("aspect-square object-cover", classNames.image)}
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
};
