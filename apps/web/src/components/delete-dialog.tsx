"use client";

import React from "react";
import { Loader2, Trash2 } from "lucide-react";
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
      <AlertDialogContent className="border-white/10 bg-card text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-white">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            This action cannot be undone. This will permanently delete
            <span className="font-semibold text-amber-400"> {entityName} </span>
            from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="h-full border-white/10 bg-transparent text-white hover:bg-white/5 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="h-full border-none bg-red-600 font-bold text-white hover:bg-red-700"
            disabled={status === "pending"}
          >
            {status === "pending" ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 size-4" />
            )}
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
