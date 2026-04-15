import { View } from "react-native";
import { MessageCircleIcon } from "lucide-react-native";

import { useT } from "@/lib/i18n";
import { ScreenWrapper } from "@/components/layout/screen-wrapper";
import { Text } from "@/components/ui/text";

export const ChatScreen = () => {
  const { t } = useT();

  return (
    <ScreenWrapper
      header={{
        title: t("mobile:screens.chat.title"), //"Chat",
        description: t("mobile:screens.chat.description"), //"Ask professionals",
        subtitle: t("mobile:screens.chat.subtitle"), //"Connect with professionals and share your progress.",
        icon: MessageCircleIcon,
      }}
    >
      <View className="mx-4 mt-10 items-center rounded-2xl border border-zinc-800 bg-zinc-900/50 px-8 py-10">
        <Text className="text-center text-zinc-400">
          {t("chatIsComingSoon")} {"\n"}
          {t("youWillBeAbleToMessageAndDiscussTrainingsWithProfessionalsHere")}
        </Text>
      </View>
    </ScreenWrapper>
  );
};
