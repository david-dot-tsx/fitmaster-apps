// eslint-disable-next-line check-file/filename-naming-convention
import { useLocalSearchParams } from "expo-router";

import { ProfileScreen } from "@/features/profile/user-profile/screens/profile.screen";

export default function CustomerProfilePage() {
  const { nickname } = useLocalSearchParams<{ nickname: string }>();

  return <ProfileScreen nickname={nickname} />;
}
