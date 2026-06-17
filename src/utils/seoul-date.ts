import { formatInTimeZone } from "date-fns-tz";

const SEOUL_TIME_ZONE = "Asia/Seoul";

export const formatInSeoulTime = (date: Date, format: string) => {
  return formatInTimeZone(date, SEOUL_TIME_ZONE, format);
};
