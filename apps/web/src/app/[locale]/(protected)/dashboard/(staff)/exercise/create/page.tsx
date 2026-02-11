import { ExerciseCreateForm } from "@/app/[locale]/(protected)/dashboard/(staff)/exercise/create/_components/exercise-create-form";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateExercisePage() {
  return (
    <PageWrapper size="medium">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-medium text-amber-400">Create Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <ExerciseCreateForm />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
