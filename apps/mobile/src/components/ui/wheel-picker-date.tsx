import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import { getYear, getMonth, getDaysInMonth, setMonth, setYear, format, setDate } from "date-fns";

import { WheelPicker } from "@/components/ui/wheel-picker";

export interface WheelPickerDateProps {
  value: Date;
  onValueChanged: (value: Date) => void;
}

// Module-level constants — computed once, never recreated
const CURRENT_YEAR = new Date().getFullYear();

const YEARS = Array.from({ length: CURRENT_YEAR - 1900 }, (_, index) => ({
  value: CURRENT_YEAR - index,
  label: (CURRENT_YEAR - index).toString(),
}));

const MONTHS = Array.from({ length: 12 }, (_, index) => ({
  value: index,
  label: (index + 1).toString(),
}));

export const WheelPickerDate = ({ value, onValueChanged }: WheelPickerDateProps) => {
  return (
    <View className="flex flex-row self-start">
      <YearPicker value={value} onValueChanged={onValueChanged} />
      <MonthPicker value={value} onValueChanged={onValueChanged} />
      <DayPicker value={value} onValueChanged={onValueChanged} />
    </View>
  );
};

const YearPicker = React.memo(function YearPicker({
  value,
  onValueChanged,
}: {
  value: Date;
  onValueChanged: (date: Date) => void;
}) {
  const currentYear = getYear(value);

  const handleChange = useCallback(
    (newYear: number) => {
      onValueChanged(setYear(value, newYear));
    },
    [value, onValueChanged],
  );

  return <WheelPicker data={YEARS} value={currentYear} onValueChanged={handleChange} />;
});

const MonthPicker = React.memo(function MonthPicker({
  value,
  onValueChanged,
}: {
  value: Date;
  onValueChanged: (date: Date) => void;
}) {
  const currentMonth = getMonth(value);

  const handleChange = useCallback(
    (newMonth: number) => {
      onValueChanged(setMonth(value, newMonth));
    },
    [value, onValueChanged],
  );

  return <WheelPicker data={MONTHS} value={currentMonth} onValueChanged={handleChange} />;
});

const DayPicker = React.memo(function DayPicker({
  value,
  onValueChanged,
}: {
  value: Date;
  onValueChanged: (date: Date) => void;
}) {
  // Only recomputed when the date's year/month actually changes
  const days = useMemo(
    () =>
      Array.from({ length: getDaysInMonth(value) }, (_, index) => ({
        value: index + 1,
        label: (index + 1).toString(),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getYear(value), getMonth(value)],
  );

  const currentDay = Number(format(value, "d"));

  const handleChange = useCallback(
    (newDay: number) => {
      onValueChanged(setDate(value, newDay));
    },
    [value, onValueChanged],
  );

  return <WheelPicker data={days} value={currentDay} onValueChanged={handleChange} />;
});
