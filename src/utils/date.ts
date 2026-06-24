import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const SEOUL_TIME_ZONE = "Asia/Seoul";

export const getRenderedDate = (input: string | number) => {
  const date = new Date(input);

  return format(date, "yy.MM.dd");
};

export const formatInSeoulTime = (date: Date, pattern: string) => {
  return formatInTimeZone(date, SEOUL_TIME_ZONE, pattern);
};
