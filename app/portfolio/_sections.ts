import { type PortfolioEntry } from "src/types/portfolio";

const CAREER_CATEGORY = "경력";
const SIDE_PROJECT_CATEGORY = "사이드프로젝트";

const normalizeCategory = (category: string) => category.replace(/\s/g, "");

export const getPortfolioSections = (
  portfolioList: PortfolioEntry[],
  featuredOnly: boolean,
) => {
  const filteredList = featuredOnly
    ? portfolioList.filter((item) => item.featured)
    : portfolioList;
  const careerList = filteredList.filter(
    (item) => item.category === CAREER_CATEGORY,
  );
  const sideProjectList = filteredList.filter(
    (item) => normalizeCategory(item.category) === SIDE_PROJECT_CATEGORY,
  );
  const etcList = filteredList.filter(
    (item) =>
      item.category !== CAREER_CATEGORY &&
      normalizeCategory(item.category) !== SIDE_PROJECT_CATEGORY,
  );

  return [
    { items: careerList, title: "careers" },
    { items: sideProjectList, title: "side projects" },
    { items: etcList, title: "기타" },
  ].filter(({ items }) => items.length > 0);
};
