import { cn } from "@/lib/utils";

export const TextTruncatedCell = ({ text, className }: { text: string; className?: string }) => {
  return <div className={cn("line-clamp-1 text-ellipsis", className)}>{text}</div>;
};
