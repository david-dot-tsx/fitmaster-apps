import React from "react";
import { times } from "remeda";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { Button } from "@/components/ui/button";

export default function ExercisePage() {
  return (
    <PageWrapper title="Exercise">
      <div className="flex w-full flex-col">
        <div className="flex flex-row justify-end">
          <Button>Add Exercise</Button>
        </div>
        <div className="mt-8 flex flex-col gap-2">
          {times(15, (index) => (
            <div key={index} className="w-full bg-slate-900 p-2 text-center">
              {index} Exercise
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
