const getDateParts = (input: string | number) => {
  const date = new Date(input);

  return [date.getFullYear() % 100, date.getMonth() + 1, date.getDate()].map(
    (value) => String(value).padStart(2, "0"),
  );
};

export const getRenderedDate = (input: string | number) => {
  return getDateParts(input).join(".");
};

export const getRenderedYearMonth = (input: string | number) => {
  return getDateParts(input).slice(0, 2).join(".");
};
