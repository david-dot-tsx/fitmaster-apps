import React, { useCallback } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { DumbbellIcon } from "lucide-react-native";

import { TrainingSessionStatus } from "@repo/validators";

import { useT } from "@/lib/i18n";
import { trpc } from "@/lib/trpc/client";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";
import { TrainingStats } from "@/features/trainings/components/training-stats";
import { TrainingExerciseList } from "@/features/trainings/components/training-exercise-list";
import { VStack } from "@/components/ui/vstack";
import { Section } from "@/components/ui/section";
import TrainingCard from "@/components/modules/training-card/training-card";
import { useToastNotification } from "@/components/modules/toast-notifcation/toast-notification";
import { QueryErrorHandler } from "@/components/modules/query-error-handler/query-error-handler";
import { useHandleApiErrorMessage } from "@/hooks/use-handle-api-error-message";

export const TrainingDetailsScreen = ({ trainingId }: { trainingId: string }) => {
  const { t } = useT();
  const { handleApiErrorMessage } = useHandleApiErrorMessage();
  const router = useRouter();
  const utils = trpc.useUtils();
  const { openToast } = useToastNotification();
  const {
    data: training,
    status,
    refetch,
    isFetching,
  } = trpc.training.getByIdCustomer.useQuery({ id: trainingId });

  const { data: myTrainings } = trpc.training.session.myTrainings.useQuery();
  const trainingSession = myTrainings?.find((t) => t.trainingId === trainingId) ?? null;

  const { mutate: newTrainingSession, status: newTrainingSessionStatus } =
    trpc.training.session.new.useMutation({
      onSuccess: (data) => {
        utils.training.session.myTrainings.invalidate();
        utils.training.invalidate();
        router.push(`/training/${trainingId}/session/${data.id}`);
      },
      onError: () => {
        handleApiErrorMessage(undefined, {
          default: () => {
            openToast({
              title: t("errors.training.session.new.failed.title"),
              description: t("errors.training.session.new.failed.description"),
              action: "error",
            });
          },
        });
      },
    });

  const getCardAction = useCallback(():
    | { onPress: () => void; text: string; disabled?: boolean }
    | undefined => {
    if (trainingSession?.status === TrainingSessionStatus.COMPLETED) {
      return;
    }
    if (trainingSession) {
      return {
        onPress: () => router.push(`/training/${trainingId}/session/${trainingSession?.id}`),
        text: t("startTraining"),
      };
    }

    return {
      onPress: () => newTrainingSession({ trainingId }),
      disabled: newTrainingSessionStatus === "pending",
      text: t("joinTraining"),
    };
  }, [trainingSession, newTrainingSessionStatus, t, router, trainingId, newTrainingSession]);

  return (
    <ScreenWrapper
      header={{
        title: training?.name ?? t("mobile:screens.trainingDetails.title"),
        description: t("mobile:screens.trainingDetails.description"),
        subtitle: t("mobile:screens.trainingDetails.subtitle"),
        icon: DumbbellIcon,
        backButton: true,
      }}
    >
      {status === "pending" && (
        <ScreenWrapper className="items-center justify-center">
          <ActivityIndicator size="large" color="#fbbf24" />
        </ScreenWrapper>
      )}
      {status === "error" && <QueryErrorHandler refetch={refetch} isFetching={isFetching} />}
      {status === "success" && (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <TrainingCard
            imageUrl={training.imageUrl ?? undefined}
            trainingName={training.name}
            stats={
              trainingSession?.stats ?? {
                totalDays: training.daysAmount,
                currentDay: 1,
                hasUserCompletedThisDay: false,
              }
            }
            status={trainingSession?.status}
            action={getCardAction()}
          />
          <VStack className="mt-4 gap-4">
            <TrainingStats
              daysAmount={training.daysAmount}
              exercisesAmount={training.exercises.length}
            />

            <Section title={t("mobile:screens.trainingDetails.aboutTraining")}>
              <Text className="text-zinc-300">{training.description}</Text>
            </Section>
            <TrainingExerciseList exercises={training.exercises} />
          </VStack>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};
