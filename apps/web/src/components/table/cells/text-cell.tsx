import React from "react";

export const TextCell = ({ text, className }: { text: string; className?: string }) => {
  return <div className={className}>{text}</div>;
};
