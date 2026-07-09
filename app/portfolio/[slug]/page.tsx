import { type Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getPortfolioDetail,
  getPublishedPortfolioEntries,
} from "src/apis/notion";
import NotionRenderer from "src/components/shared/notion-renderer";
import { METADATA } from "src/utils/constants";
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

const PortfolioDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  const portfolioDetail = await getPortfolioDetail(slug);

  if (!portfolioDetail) return notFound();

  const { portfolioItem, recordMap } = portfolioDetail;

  return (
    <main className="min-h-dvh w-full bg-white">
      <section className="min-w-limit max-w-content mx-auto w-full p-4">
        <NotionRenderer recordMap={recordMap} rootPageId={portfolioItem.id} />
      </section>
    </main>
  );
};

export default PortfolioDetailPage;
