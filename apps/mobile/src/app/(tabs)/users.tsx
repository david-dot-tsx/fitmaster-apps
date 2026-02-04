import { FlatList, View, Text } from "react-native";

import { trpc } from "@/lib/trpc/client";

export default function TabThreeScreen() {
  const { data, status, error } = trpc.user.list.useQuery();
  // eslint-disable-next-line no-console
  console.log("data", JSON.stringify(data, null, 2));
  // eslint-disable-next-line no-console
  console.log("status", status);
  // eslint-disable-next-line no-console
  console.log(error);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <Text style={{ fontSize: 24, fontWeight: "bold", padding: 20 }}>Users</Text>
        )}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            <Text style={{ fontSize: 16, color: "#333" }}>{item.email}</Text>
            <Text style={{ fontSize: 12, color: "#999" }}>ID: {item.id}</Text>
          </View>
        )}
      />
    </View>
  );
}
