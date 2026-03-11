import React from "react";
import { Pressable, View } from "react-native";
import { AnimatePresence, MotiView } from "moti";
import { XIcon } from "lucide-react-native";

import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { LanguagePicker } from "@/components/ui/language-picker";

type SettingsSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SettingsSheet = ({ isOpen, onClose }: SettingsSheetProps) => (
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
            <Heading className="text-lg font-black uppercase italic tracking-tighter text-zinc-100">
              Settings
            </Heading>
            <Pressable
              onPress={onClose}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-2"
            >
              <Icon as={XIcon} size="sm" color="#71717a" />
            </Pressable>
          </View>

          <LanguagePicker />
        </MotiView>
      )}
    </AnimatePresence>
  </>
);
