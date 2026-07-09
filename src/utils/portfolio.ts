import { type PortfolioEntry } from "src/types/portfolio";
import { getRenderedYearMonth } from "src/utils/date";

export const getRenderedPortfolioPeriod = (
  period: PortfolioEntry["period"],
) => {
  if (!period) return "";
  if (!Array.isArray(period)) return `${getRenderedYearMonth(period)} - ing`;

  const [startDate, endDate] = period;

  if (!startDate) return "";

  return `${getRenderedYearMonth(startDate)} - ${
    endDate ? getRenderedYearMonth(endDate) : "ing"
  }`;
};
