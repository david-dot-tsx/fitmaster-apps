// "use client";

// import React from "react";
// import { Loader2, Trash2 } from "lucide-react";
// import { type AlertDialogProps } from "@radix-ui/react-alert-dialog";
// import { type MutationStatus } from "@tanstack/react-query";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// type DeleteDialogProps = Pick<AlertDialogProps, "open" | "onOpenChange"> & {
//   onConfirm: () => void;
//   status: MutationStatus;
//   entityName: string;
// };
// export const DeleteDialog = ({
//   open,
//   onOpenChange,
//   onConfirm,
//   status,
//   entityName,
// }: DeleteDialogProps) => {
//   return (
//     <AlertDialog open={open} onOpenChange={onOpenChange}>
//       <AlertDialogContent className="border-white/10 bg-card text-white">
//         <AlertDialogHeader>
//           <AlertDialogTitle className="text-xl font-bold text-white">
//             Are you absolutely sure?
//           </AlertDialogTitle>
//           <AlertDialogDescription className="text-slate-400">
//             This action cannot be undone. This will permanently delete
//             <span className="font-semibold text-amber-400"> {entityName} </span>
//             from the database.
//           </AlertDialogDescription>
//         </AlertDialogHeader>

//         <AlertDialogFooter className="mt-4">
//           <AlertDialogCancel className="h-full border-white/10 bg-transparent text-white hover:bg-white/5 hover:text-white">
//             Cancel
//           </AlertDialogCancel>
//           <AlertDialogAction
//             onClick={(e) => {
//               e.preventDefault();
//               onConfirm();
//             }}
//             className="h-full border-none bg-red-600 font-bold text-white hover:bg-red-700"
//             disabled={status === "pending"}
//           >
//             {status === "pending" ? (
//               <Loader2 className="mr-2 size-4 animate-spin" />
//             ) : (
//               <Trash2 className="mr-2 size-4" />
//             )}
//             Confirm Delete
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

"use client";

import React from "react";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { type AlertDialogProps } from "@radix-ui/react-alert-dialog";
import { type MutationStatus } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type DeleteDialogProps = Pick<AlertDialogProps, "open" | "onOpenChange"> & {
  onConfirm: () => void;
  status: MutationStatus;
  entityName: string;
};

export const DeleteDialog = ({
  open,
  onOpenChange,
  onConfirm,
  status,
  entityName,
}: DeleteDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-red-900/30 bg-zinc-950/90 backdrop-blur-2xl sm:max-w-[450px]">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />

        <AlertDialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
              <AlertTriangle className="size-5 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
            </div>
            <AlertDialogTitle className="text-xl font-black uppercase italic tracking-tighter text-zinc-100">
              Delete <span className="text-red-500">{entityName}</span>
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="text-xs font-bold uppercase leading-relaxed tracking-widest text-zinc-500">
            WARNING: This action is irreversible. You are attempting to permanently delete the
            following record:
            <span className="mt-2 block text-sm font-black normal-case italic tracking-normal text-zinc-200">
              &quot;{entityName}&quot;
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
          <AlertDialogCancel className="border-zinc-800 bg-transparent text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200">
            Abort
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={status === "pending"}
            className={cn(
              "bg-red-600 text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all hover:bg-red-700",
              status === "pending" && "cursor-not-allowed opacity-50",
            )}
          >
            {status === "pending" ? (
              <Loader2 className="mr-2 size-3 animate-spin" />
            ) : (
              <Trash2 className="mr-2 size-3" />
            )}
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
