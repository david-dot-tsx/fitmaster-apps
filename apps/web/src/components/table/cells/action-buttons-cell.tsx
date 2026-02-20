import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ActionButtonsCellProps = {
  onDelete: () => void;
  className?: string;
} & ({ editLink: string; onEdit?: never } | { editLink?: never; onEdit: () => void }) & {
    children?: React.ReactNode;
  };

export const ActionButtonsCell = ({
  onDelete,
  className,
  editLink,
  onEdit,
  children,
}: ActionButtonsCellProps) => {
  // Wspólny styl dla przycisków w tabeli
  const actionButtonClass =
    "h-8 w-8 p-0 bg-zinc-900/50 border border-zinc-800 transition-all duration-200 backdrop-blur-sm";

  return (
    <TooltipProvider>
      <div
        className={cn("flex w-fit flex-row items-center gap-2", className)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {children}
        {/* Przycisk Edycji */}
        <Tooltip>
          <TooltipTrigger asChild>
            {editLink ? (
              <Button
                asChild
                variant="outline"
                className={cn(
                  actionButtonClass,
                  "hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400",
                )}
              >
                <Link href={editLink}>
                  <Edit2 className="size-3.5" />
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={onEdit}
                className={cn(
                  actionButtonClass,
                  "hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400",
                )}
              >
                <Edit2 className="size-3.5" />
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent className="border-zinc-800 bg-zinc-950 text-[10px] font-black uppercase tracking-widest text-amber-400">
            Edit
          </TooltipContent>
        </Tooltip>

        {/* Przycisk Usuwania */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={onDelete}
              className={cn(
                actionButtonClass,
                "hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500",
              )}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="border-zinc-800 bg-zinc-950 text-[10px] font-black uppercase tracking-widest text-red-500">
            Delete
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
