import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { DumbbellIcon } from "lucide-react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { useTranslation } from "react-i18next";

import { WorkoutExerciseSessionStatus } from "@repo/validators";
import { NAMESPACES } from "@repo/i18n/mobile";

import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Button, ButtonText } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { Text } from "@/components/ui/text";
import { TraitList } from "@/features/trainings/components/session-exercise/exercise-trait-list";
import { StopWatch, useStopWatch } from "@/components/stop-watch";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useToastNotification } from "@/components/modules/toast-notifcation/toast-notification";
import { QueryErrorHandler } from "@/components/modules/query-error-handler/query-error-handler";
import { Section } from "@/components/ui/section";
import { FoldableText } from "@/components/foldable-text";
import { ContentHero } from "@/components/modules/content-hero/content-hero";
import { Icon } from "@/components/ui/icon";
import { getWorkoutBlockDisplay } from "@/features/trainings/constants/workout-block-display";

export const TrainingSessionExerciseScreen = ({
  trainingId,
  sessionId,
}: {
  trainingId: string;
  sessionId: string;
}) => {
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);
  const stopWatchProps = useStopWatch();
  const utils = trpc.useUtils();
  const { openToast } = useToastNotification();
  const { data, isFetching, refetch, status } = trpc.training.session.getCurrentExercise.useQuery({
    trainingSessionId: sessionId,
  });

  const currentExercise = data?.currentExercise;
  const exerciseEntity = currentExercise?.workoutExercise?.exercise;
  const isLastExercise = data?.exercisesLeftAmount === 0;

  const { mutate: startExercise } = trpc.training.session.startExercise.useMutation({
    onSuccess: () => {
      if (!stopWatchProps.running) {
        stopWatchProps.toggleStopWatch();
      }
      utils.training.session.getCurrentExercise.invalidate();
    },
    onError: (_error) => {
      openToast({
        title: t("errors.exercise.start.failed.title"),
        description: t("errors.exercise.start.failed.description"),
        action: "error",
      });
    },
  });

  const { mutate: completeExercise } = trpc.training.session.completeExercise.useMutation({
    onSuccess: () => {
      utils.training.session.getCurrentExercise.invalidate();
      if (isLastExercise) {
        router.push(`/training/${trainingId}/session/${sessionId}/finished`);
      }
    },
    onError: (_error) => {
      openToast({
        title: t("errors.exercise.finish.failed.title"),
        description: t("errors.exercise.finish.failed.description"),
        action: "error",
      });
    },
    onSettled: () => {
      stopWatchProps.resetStopWatch();
    },
  });

  return (
    <ScreenWrapper
      header={{
        title: exerciseEntity?.name ?? t("mobile:screens.trainingSessionExercise.title"),
        description: t("mobile:screens.trainingSessionExercise.description"),
        subtitle: t("mobile:screens.trainingSessionExercise.subtitle"),
        icon: DumbbellIcon,
        backButton: true,
      }}
    >
      {status === "pending" && (
        <ScreenWrapper className="items-center justify-center">
          <ActivityIndicator size="large" color="#fbbf24" />
        </ScreenWrapper>
      )}
      {status === "error" && (
        <View className="flex-1 justify-center px-4">
          <QueryErrorHandler refetch={refetch} isFetching={isFetching} />
        </View>
      )}
      {status === "success" && data != null && currentExercise != null && (
        <View className="flex-1">
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 24,
              paddingHorizontal: 16,
            }}
          >
            <ContentHero className="mt-1" imageUrl={exerciseEntity?.imageUrl ?? null} />
            <VStack className="mt-2 gap-4 pb-4">
              <SessionExerciseOverview
                workoutBlockType={currentExercise.workoutExercise.workoutBlockType}
                exercisesLeftAmount={data.exercisesLeftAmount}
                totalExercisesAmount={data.totalExercisesAmount}
                currentExerciseStatus={currentExercise.status}
              />

              <StopWatch
                {...stopWatchProps}
                disabled={currentExercise.status === WorkoutExerciseSessionStatus.NOT_STARTED}
              />

              <Section title={t("description")}>
                <FoldableText text={exerciseEntity?.description ?? ""} />
              </Section>

              <Section title={t("traits")}>
                <TraitList sessionExercise={currentExercise} />
              </Section>
            </VStack>
          </ScrollView>

          <View className="border-t border-zinc-800 bg-zinc-950 px-4 pb-6 pt-4">
            <Button
              size="lg"
              action="primary"
              className="w-full bg-amber-400"
              onPress={() => {
                if (currentExercise.status === WorkoutExerciseSessionStatus.NOT_STARTED) {
                  startExercise({
                    workoutExerciseSessionId: currentExercise.id,
                  });
                } else {
                  stopWatchProps.setRunning(false);
                  completeExercise({
                    workoutExerciseSessionId: currentExercise.id,
                    timeSpentMiliseconds: stopWatchProps.elapsed,
                  });
                }
              }}
            >
              <ButtonText className="font-semibold text-zinc-950">
                {currentExercise.status === WorkoutExerciseSessionStatus.IN_PROGRESS
                  ? t("completeExercise")
                  : t("startExercise")}
              </ButtonText>
            </Button>
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
};

const getSessionExerciseIndex = (
  status: WorkoutExerciseSessionStatus,
  exercisesLeftAmount: number,
  totalExercisesAmount: number,
) => {
  if (status === WorkoutExerciseSessionStatus.NOT_STARTED) {
    return totalExercisesAmount - exercisesLeftAmount + 1;
  }

  return totalExercisesAmount - exercisesLeftAmount;
};

/**
 * TODO: Improve badge with icon
 */

const SessionExerciseOverview = ({
  workoutBlockType,
  exercisesLeftAmount,
  totalExercisesAmount,
  currentExerciseStatus,
}: {
  workoutBlockType: string;
  exercisesLeftAmount?: number;
  totalExercisesAmount?: number;
  currentExerciseStatus: WorkoutExerciseSessionStatus;
}) => {
  const { t } = useTranslation([NAMESPACES.COMMON, NAMESPACES.MOBILE]);
  const hasProgress =
    exercisesLeftAmount != null && totalExercisesAmount != null && totalExercisesAmount > 0;
  const currentIndex =
    hasProgress && exercisesLeftAmount != null && totalExercisesAmount != null
      ? getSessionExerciseIndex(currentExerciseStatus, exercisesLeftAmount, totalExercisesAmount)
      : null;

  const block = getWorkoutBlockDisplay(workoutBlockType);

  return (
    <View className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-3">
      <HStack className={hasProgress ? "items-center gap-3" : "items-center"}>
        {hasProgress && currentIndex != null && (
          <>
            <View className="min-w-0 flex-1">
              <Text className="font-orbitron-semibold text-2xs uppercase tracking-widest text-zinc-500">
                {t("progress")}
              </Text>
              <HStack className="mt-1 items-baseline gap-1">
                <Text className="font-orbitron-semibold text-2xl tabular-nums tracking-tighter text-zinc-100">
                  {currentIndex}
                </Text>
                <Text className="pb-0.5 text-lg font-medium text-zinc-600">/</Text>
                <Text className="font-orbitron-semibold text-xl tabular-nums text-zinc-400">
                  {totalExercisesAmount}
                </Text>
              </HStack>
              <Text className="mt-1 text-2xs text-zinc-600">{t("exerciseInThisSession")}</Text>
            </View>
            <View className="h-14 w-px self-stretch bg-zinc-800" />
          </>
        )}
        <View className={cn("min-w-0 flex-1", hasProgress && "items-end")}>
          <Text
            className={cn(
              "font-orbitron-semibold text-2xs uppercase tracking-widest text-zinc-500",
              hasProgress && "text-right",
            )}
          >
            {t("block")}
          </Text>
          <HStack
            className={cn(
              "mt-1 max-w-full items-center gap-2 rounded-lg border bg-zinc-950/80 px-3 py-2",
              block.pillBorderClass,
              hasProgress ? "self-end" : "self-start",
            )}
          >
            <Icon as={block.icon} size="sm" className={block.accentClass} />
            <Text
              className={cn("flex-1 text-sm font-semibold tracking-wide", block.accentClass)}
              numberOfLines={2}
            >
              {t(block.label)}
            </Text>
          </HStack>
        </View>
      </HStack>
    </View>
  );
};
