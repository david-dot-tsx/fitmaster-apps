import React from "react";
import { Pressable, View } from "react-native";
import { AnimatePresence, MotiView } from "moti";
import { XIcon } from "lucide-react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { LanguagePicker } from "@/components/ui/language-picker";
import { useAuthContext } from "@/providers/auth/auth-context";

type SettingsSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SettingsSheet = ({ isOpen, onClose }: SettingsSheetProps) => {
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "timing", duration: 250 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            className="bg-black/60"
          >
            <Pressable className="flex-1" onPress={onClose} />
          </MotiView>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <MotiView
            from={{ translateY: 500 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: 500 }}
            transition={{ type: "timing", duration: 300 }}
            style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
            className="rounded-t-3xl border border-zinc-800 bg-zinc-950 px-4 pb-10 pt-5"
          >
            {/* Drag handle */}
            <View className="mb-5 items-center">
              <View className="h-1 w-10 rounded-full bg-zinc-700" />
            </View>

            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <Heading className="text-lg uppercase tracking-tighter text-zinc-100">
                Settings
              </Heading>
              <Pressable
                onPress={onClose}
                className="rounded-md border border-zinc-800 bg-zinc-900 p-2"
              >
                <Icon as={XIcon} size="sm" color="#71717a" />
              </Pressable>
            </View>

            <LanguagePicker />

            <Button
              onPress={handleLogout}
              action="negative"
              variant="outline"
              className="mt-4  border-red-900 bg-red-900/20"
            >
              <ButtonText className="text-sm uppercase tracking-tight text-red-300">
                Logout
              </ButtonText>
            </Button>
          </MotiView>
        )}
      </AnimatePresence>
    </>
  );
};
