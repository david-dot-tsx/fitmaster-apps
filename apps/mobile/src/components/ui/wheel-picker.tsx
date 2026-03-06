import React from "react";
import QuidoneWheelPicker from "@quidone/react-native-wheel-picker";
import { View } from "react-native";

import { Text } from "./text";

export interface WheelPickerProps {
  data: { value: number; label: string }[];
  value: number;
  onValueChanged: (value: number) => void;
  unit?: string;
}

// Stable render callbacks — defined outside the component so they are never
// recreated between renders, which lets QuidoneWheelPicker skip re-rendering
// individual items when nothing has changed.
const renderItem = ({ item }: { item: { value: number; label: string } }) => (
  <View className="mx-4 h-full items-center justify-center">
    <Text className="text-3xl font-bold text-white">{item.label}</Text>
  </View>
);

const renderOverlay = ({ itemHeight }: { itemHeight: number }) => (
  <View
    className="pointer-events-none absolute top-1/2 size-full -translate-y-1/2"
    style={{ height: itemHeight }}
  >
    <View className="absolute top-0 h-[2px] w-full rounded-2xl bg-amber-500" />
    <View className="absolute bottom-0 h-[2px] w-full rounded-2xl bg-amber-500" />
  </View>
);

export const WheelPicker = React.memo(function WheelPicker({
  data,
  value,
  onValueChanged,
  unit,
}: WheelPickerProps) {
  return (
    <View className="flex flex-col px-2">
      <View className="flex-row">
        <QuidoneWheelPicker
          data={data}
          value={value}
          onValueChanged={({ item }) => onValueChanged(item.value)}
          enableScrollByTapOnItem={true}
          renderItem={renderItem}
          renderOverlay={renderOverlay}
        />
        {unit && (
          <View className="ml-2.5 items-center justify-center">
            <Text className="text-2xl font-semibold text-white">{unit}</Text>
          </View>
        )}
      </View>
    </View>
  );
});
