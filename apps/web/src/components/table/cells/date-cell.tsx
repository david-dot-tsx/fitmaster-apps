import React from "react";

import { DATE_FORMATS, type DateFormats } from "@/consts/date-formats";
import { formatDate } from "@/helpers/format-date";

export const DateCell = ({
  date,
  dateFormat = DATE_FORMATS.DATE,
  className,
}: {
  date: Date;
  dateFormat?: DateFormats;
  className?: string;
}) => {
  return <span className={className}>{formatDate(date, dateFormat)}</span>;
};
