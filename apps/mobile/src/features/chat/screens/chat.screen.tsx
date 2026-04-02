import { View } from "react-native";
import { MessageCircleIcon } from "lucide-react-native";

import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";

export const ChatScreen = () => {
  return (
    <ScreenWrapper
      header={{
        title: "Chat",
        description: "Ask professionals",
        subtitle: "Connect with professionals and share your progress.",
        icon: MessageCircleIcon,
      }}
    >
      <View className="mx-4 mt-10 items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 px-8 py-10">
        <Text className="text-center text-zinc-400">
          Chat is coming soon.{"\n"}You will be able to message and discuss trainings with
          professionals here.
        </Text>
      </View>
    </ScreenWrapper>
  );
};
