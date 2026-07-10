import { type Metadata } from "next";
import { idToUuid } from "notion-utils";

import PortfolioList from "app/portfolio/_components/portfolio-list";
import { getPortfolioPage } from "src/apis/notion";
import CareerPageBadge from "src/components/shared/career-page-badge";
import NotionRenderer from "src/components/shared/notion-renderer";
import UnderConstruction from "src/components/shared/under-construction";
import { METADATA, NOTION_PAGE_IDS } from "src/utils/constants";
import { getPortfolioUrl } from "src/utils/routes";

type Props = {
  searchParams: Promise<{
    featured?: string | string[];
  }>;
};

export const revalidate = 30;

export const metadata: Metadata = {
  title: "portfolio",
  openGraph: {
    url: getPortfolioUrl(),
    title: `portfolio | ${METADATA.meta.title}`,
  },
};

const PortfolioPage = async ({ searchParams }: Props) => {
  const { jobSearchStatus, lastEditedTime, portfolioList, recordMap, status } =
    await getPortfolioPage();
  const featured = (await searchParams).featured;
  const featuredOnly =
    (Array.isArray(featured) ? featured[0] : featured) !== "false";

  if (status !== "Published") return <UnderConstruction />;

  return (
    <main className="min-h-dvh w-full bg-white">
      <section className="min-w-limit max-w-content mx-auto w-full p-4">
        <CareerPageBadge
          jobSearchStatus={jobSearchStatus}
          lastEditedTime={lastEditedTime}
        />
        <NotionRenderer
          recordMap={recordMap}
          renderCollection={false}
          rootPageId={idToUuid(NOTION_PAGE_IDS.portfolio)}
        />
        <PortfolioList
          featuredOnly={featuredOnly}
          portfolioList={portfolioList}
        />
      </section>
    </main>
  );
};

export default PortfolioPage;
