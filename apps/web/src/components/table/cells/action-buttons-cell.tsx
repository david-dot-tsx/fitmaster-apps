import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActionButtonsCellProps = {
  onDelete: () => void;
  className?: string;
} & ({ editLink: string; onEdit?: never } | { editLink?: never; onEdit: () => void });

export const ActionButtonsCell = ({
  onDelete,
  className,
  editLink,
  onEdit,
}: ActionButtonsCellProps) => {
  return (
    <div
      className={cn("flex w-fit flex-row gap-2", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {editLink && (
        <Button asChild>
          <Link href={editLink}>Edit</Link>
        </Button>
      )}
      {onEdit && <Button onClick={onEdit}>Edit</Button>}
      <Button variant="destructive" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};
