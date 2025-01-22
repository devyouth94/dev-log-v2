import { format } from "date-fns";

export const getRenderedDate = (input: string | number) => {
  const date = new Date(input);

  return format(date, "yy.MM.dd");
};
