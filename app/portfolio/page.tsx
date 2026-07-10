import { type Metadata } from "next";
import Link from "next/link";
import { idToUuid } from "notion-utils";

import PortfolioList from "app/portfolio/_components/portfolio-list";
import { getPortfolioPage } from "src/apis/notion";
import CareerPageBadge from "src/components/shared/career-page-badge";
import NotionRenderer from "src/components/shared/notion-renderer";
import UnderConstruction from "src/components/shared/under-construction";
import { cn } from "src/utils/class-name";
import { METADATA, NOTION_PAGE_IDS } from "src/utils/constants";
import { getPortfolioPath, getPortfolioUrl } from "src/utils/routes";

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
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <CareerPageBadge
            className="mb-0"
            jobSearchStatus={jobSearchStatus}
            lastEditedTime={lastEditedTime}
          />
          <Link
            href={
              featuredOnly
                ? `${getPortfolioPath()}?featured=false`
                : getPortfolioPath()
            }
            aria-label={
              featuredOnly ? "전체 포트폴리오 보기" : "대표 포트폴리오만 보기"
            }
            className="font-roboto ml-auto flex items-center justify-end gap-2 px-3 text-xs font-medium focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-gray-950"
          >
            <span>대표 포트폴리오만 보기</span>
            <span
              aria-hidden
              className={cn(
                "size-3 border border-gray-950 bg-white",
                featuredOnly && "bg-gray-950",
              )}
            />
          </Link>
        </div>
        <NotionRenderer
          className="py-0!"
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
