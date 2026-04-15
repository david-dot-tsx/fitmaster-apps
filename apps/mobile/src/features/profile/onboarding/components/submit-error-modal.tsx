import React from "react";

import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { useT } from "@/lib/i18n";

interface SubmitErrorModalProps {
  isOpen: boolean;
  onTryAgain: () => void;
  onRestartForm: () => void;
}

export const SubmitErrorModal = ({ isOpen, onTryAgain, onRestartForm }: SubmitErrorModalProps) => {
  const { t } = useT();

  return (
    <Modal isOpen={isOpen}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg" className="text-typography-950">
            {t("mobile:screens.onboarding.steps.failed.title")}
          </Heading>
        </ModalHeader>
        <ModalBody>
          <Text size="sm" className="text-typography-500">
            {t("mobile:screens.onboarding.steps.failed.description")}
          </Text>
        </ModalBody>
        <ModalFooter className="flex-col gap-3">
          <Button className="w-full" onPress={onTryAgain}>
            <ButtonText>{t("mobile:screens.onboarding.steps.failed.restartForm")}</ButtonText>
          </Button>
          <Button className="w-full" action="secondary" variant="outline" onPress={onRestartForm}>
            <ButtonText>{t("mobile:screens.onboarding.steps.failed.button")}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
