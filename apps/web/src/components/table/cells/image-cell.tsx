"use client";
import React from "react";
import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";
interface ImageCellProps extends ImageProps {
  className?: string;
}
export const ImageCell = ({ className, width = 54, height = 54, ...props }: ImageCellProps) => {
  return (
    <div style={{ width, height }}>
      <Image
        className={cn("aspect-square object-cover", className)}
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
};
