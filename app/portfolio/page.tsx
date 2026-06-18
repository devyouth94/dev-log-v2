import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { idToUuid } from "notion-utils";

import { getPortfolioPage } from "src/apis/notion";
import NotionRenderer from "src/components/shared/notion-renderer";
import { METADATA, NOTION_PAGE_IDS } from "src/utils/constants";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "portfolio",
  openGraph: {
    url: `${METADATA.meta.url}/portfolio`,
    title: `portfolio | ${METADATA.meta.title}`,
  },
};

const PortfolioPage = async () => {
  const recordMap = await getPortfolioPage();

  if (!recordMap) return notFound();

  return (
    <main className="min-h-dvh w-full bg-white">
      <section className="min-w-limit max-w-content mx-auto w-full p-4">
        <NotionRenderer
          recordMap={recordMap}
          rootPageId={idToUuid(NOTION_PAGE_IDS.portfolio)}
        />
      </section>
    </main>
  );
};

export default PortfolioPage;
