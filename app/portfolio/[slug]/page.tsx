import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";

import {
  getPortfolioDetail,
  getPublishedPortfolioEntries,
} from "src/apis/notion";
import NotionRenderer from "src/components/shared/notion-renderer";
import { Badge } from "src/components/ui/badge";
import { type PortfolioEntry } from "src/types/portfolio";
import { METADATA } from "src/utils/constants";
import { getRenderedPortfolioPeriod } from "src/utils/portfolio";
import { getPortfolioUrl, OG_IMAGE_URL } from "src/utils/routes";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 30;

export const generateStaticParams = async () => {
  const portfolioList = await getPublishedPortfolioEntries();

  return portfolioList.map((entry) => ({ slug: entry.slug }));
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const portfolioDetail = await getPortfolioDetail(slug);

  if (!portfolioDetail) return {};

  const { portfolioItem } = portfolioDetail;

  return {
    title: portfolioItem.title,
    description: portfolioItem.summary,
    openGraph: {
      url: getPortfolioUrl(portfolioItem.slug),
      title: `${portfolioItem.title} | ${METADATA.meta.title}`,
      images: [
        portfolioItem.thumbnail
          ? { url: portfolioItem.thumbnail }
          : {
              url: OG_IMAGE_URL,
              width: 1200,
              height: 630,
            },
      ],
    },
  };
};

const PortfolioDetailSummary = ({
  portfolioItem,
}: {
  portfolioItem: PortfolioEntry;
}) => {
  const period = getRenderedPortfolioPeriod(portfolioItem.period);

  return (
    <section className="flex flex-col items-center gap-4 pb-5 text-center">
      <div className="flex flex-col items-center justify-center gap-1">
        <span className="text-3xl font-extrabold">{portfolioItem.title}</span>
        {!!portfolioItem.summary && <span>{portfolioItem.summary}</span>}
      </div>

      {portfolioItem.stacks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1">
          {portfolioItem.stacks.map((stack) => (
            <Badge key={stack}>{stack}</Badge>
          ))}
        </div>
      )}

      {!!period && (
        <div className="font-roboto flex items-center gap-1 text-xs">
          <Calendar size={14} strokeWidth={1.2} />
          <span>{period}</span>
        </div>
      )}
    </section>
  );
};

const PortfolioDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  const portfolioDetail = await getPortfolioDetail(slug);

  if (!portfolioDetail) return notFound();

  const { portfolioItem, recordMap } = portfolioDetail;

  return (
    <main className="min-h-dvh w-full bg-white">
      <section className="min-w-limit max-w-content mx-auto w-full divide-y divide-gray-200 p-4 pt-24">
        <PortfolioDetailSummary portfolioItem={portfolioItem} />
        <NotionRenderer recordMap={recordMap} rootPageId={portfolioItem.id} />
      </section>
    </main>
  );
};

export default PortfolioDetailPage;
