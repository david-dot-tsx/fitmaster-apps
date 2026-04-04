import React from "react";
import {
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Bell,
  type LucideIcon,
} from "lucide-react-native";
import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { type InterfaceToastProps } from "@gluestack-ui/core/lib/esm/toast/creator/types";

import { Toast, ToastTitle, ToastDescription, useToast } from "@/components/ui/toast";
import { Icon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

interface IToastNotificationProps extends Omit<React.ComponentProps<typeof Toast>, "variant"> {
  title: string;
  description: string;
  customIcon?: LucideIcon;
}
export type ToastAction = Exclude<IToastNotificationProps["action"], undefined>;

const iconMap: Record<ToastAction, LucideIcon> = {
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
  muted: Bell,
};
export const ToastNotification = ({
  title,
  description,
  action = "muted",
  customIcon,
  ...props
}: IToastNotificationProps) => {
  return (
    <Toast nativeID="toast-2" {...props} action={action} variant="outline">
      <HStack className="items-center gap-2">
        <Icon
          as={customIcon || iconMap[action]}
          size="2xl"
          className={cn({
            "text-error-500": action === "error",
            "text-warning-500": action === "warning",
            "text-success-500": action === "success",
            "text-info-500": action === "info",
            "text-background-500": action === "muted",
          })}
        />
        <VStack className=" border-red-500">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
        </VStack>
      </HStack>
    </Toast>
  );
};
interface OpenToastProps {
  title: string;
  description: string;
  action: ToastAction;
  settings?: Omit<InterfaceToastProps, "id" | "render">;
}

export const useToastNotification = () => {
  const toast = useToast();
  const [toastId, setToastId] = React.useState<string | undefined>(undefined);

  const openToast = (props: OpenToastProps) => {
    if (!toast.isActive(toastId as string)) {
      showNewToast(props);
    }
  };
  const showNewToast = ({ title, description, action, settings }: OpenToastProps) => {
    const toastNewId = Math.random().toString();
    setToastId(toastNewId);
    toast.show({
      id: toastNewId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        return (
          <ToastNotification
            title={title}
            description={description}
            action={action}
            nativeID={id}
          />
        );
      },
      ...settings,
    });
  };

  return {
    openToast,
  };
};
