import React from "react";
import Image from "next/image";

import { type ExerciseBaseWithId } from "@repo/validators";

import { Badge } from "@/components/ui/badge";

interface ExercisePreviewProps {
  exercise?: ExerciseBaseWithId;
}

export const ExercisePreview = ({ exercise }: ExercisePreviewProps) => {
  if (!exercise) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <Image
          src={exercise.imageUrl}
          alt={exercise.name}
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        <Badge className="absolute bottom-2 left-2 bg-amber-400 text-black hover:bg-amber-400">
          {exercise.difficulty}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <p className="text-[10px] font-bold uppercase text-zinc-500">Body Part</p>
          <p className="text-sm font-medium text-zinc-200">{exercise.bodyPart}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <p className="text-[10px] font-bold uppercase text-zinc-500">Difficulty</p>
          <p className="text-sm font-medium text-zinc-200">{exercise.difficulty}</p>
        </div>
        <div className="col-span-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <p className="text-[10px] font-bold uppercase text-zinc-500">Description</p>
          <p className="line-clamp-2 text-xs text-zinc-400">{exercise.description}</p>
        </div>
      </div>
    </div>
  );
};
