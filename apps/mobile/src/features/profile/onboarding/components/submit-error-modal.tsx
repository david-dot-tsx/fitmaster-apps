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

interface SubmitErrorModalProps {
  isOpen: boolean;
  onTryAgain: () => void;
  onRestartForm: () => void;
}

export const SubmitErrorModal = ({ isOpen, onTryAgain, onRestartForm }: SubmitErrorModalProps) => {
  return (
    <Modal isOpen={isOpen}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg" className="text-typography-950">
            Submission Failed
          </Heading>
        </ModalHeader>
        <ModalBody>
          <Text size="sm" className="text-typography-500">
            Something went wrong while creating your profile. You can try again or restart the form
            from the beginning.
          </Text>
        </ModalBody>
        <ModalFooter className="flex-col gap-3">
          <Button className="w-full" onPress={onTryAgain}>
            <ButtonText>Try Again</ButtonText>
          </Button>
          <Button className="w-full" action="secondary" variant="outline" onPress={onRestartForm}>
            <ButtonText>Restart Form</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
