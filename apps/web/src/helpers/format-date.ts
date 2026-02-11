import { format } from "date-fns";

import { type DateFormats } from "@/consts/date-formats";

export const formatDate = (date: Date, dateFormat: DateFormats) => {
  return format(date, dateFormat);
};
