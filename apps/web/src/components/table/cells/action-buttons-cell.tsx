import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ActionButtonsCell = ({
  editLink,
  onDelete,
  className,
}: {
  editLink: string;
  onDelete: () => void;
  className?: string;
}) => {
  return (
    <div
      className={cn("flex w-fit flex-row gap-2", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Button asChild>
        <Link href={editLink}>Edit</Link>
      </Button>
      <Button variant="destructive" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};
