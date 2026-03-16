import React from "react";

import { Heading } from "@/components/ui/heading";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { trpc } from "@/lib/trpc/client";
import { Button, ButtonText } from "@/components/ui/button";

export const TrainingDoScreen = ({ id }: { id: string }) => {
  const { data: myTrainings } = trpc.training.enrolment.myTrainings.useQuery();
  const enrolment = myTrainings?.find((t) => t.trainingId === id) ?? null;
  const { data: currentExercise, refetch: refetchCurrentExercise } =
    trpc.training.enrolment.getCurrentExercise.useQuery(
      {
        progressCustomerTrainingId: enrolment?.id ?? "",
      },
      {
        enabled: !!enrolment?.id,
      },
    );
  const { data, mutate: startDayMutation } = trpc.training.enrolment.startDay.useMutation({
    onSuccess: () => {
      console.log("training started");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <ScreenWrapper className="p-6">
      <Heading className="text-center text-amber-400">TrainingDoScreen </Heading>
      <VStack className="gap-2">
        <Button
          onPress={() => {
            console.log({ enrolment });

            if (enrolment) {
              startDayMutation({
                progressCustomerTrainingId: enrolment.id,
              });
            }
          }}
        >
          <ButtonText>Start Training</ButtonText>
        </Button>
        <Button
          onPress={() => {
            refetchCurrentExercise();
          }}
        >
          <ButtonText>Refetch Current Exercise</ButtonText>
        </Button>
      </VStack>
      <VStack className="mt-4 gap-4">
        <VStack>
          <Text className="font-bold uppercase text-zinc-400">Training Enrollment id: </Text>
          <Text className="text-zinc-300">{id}</Text>
        </VStack>
        <VStack className="hidden">
          <Text className="font-bold uppercase text-zinc-400">My trainings: </Text>
          <Text className="text-zinc-300">{JSON.stringify(myTrainings, null, 2)}</Text>
        </VStack>
        <VStack className="hidden">
          <Text className="font-bold uppercase text-zinc-400">data: </Text>
          <Text className="text-zinc-300">{JSON.stringify(data, null, 2)}</Text>
        </VStack>
        <VStack>
          <Text className="font-bold uppercase text-zinc-400">currentExercise: </Text>
          <Text className="text-zinc-300">{JSON.stringify(currentExercise, null, 2)}</Text>
        </VStack>
      </VStack>
    </ScreenWrapper>
  );
};
