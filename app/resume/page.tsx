import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { idToUuid } from "notion-utils";

import { getResumePage } from "src/apis/notion";
import CareerPageBadge from "src/components/shared/career-page-badge";
import NotionRenderer from "src/components/shared/notion-renderer";
import UnderConstruction from "src/components/shared/under-construction";
import { METADATA, NOTION_PAGE_IDS } from "src/utils/constants";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "resume",
  openGraph: {
    url: `${METADATA.meta.url}/resume`,
    title: `resume | ${METADATA.meta.title}`,
  },
};

const ResumePage = async () => {
  const resumePage = await getResumePage();

  if (!resumePage) return notFound();
  if (resumePage.status !== "Published") return <UnderConstruction />;

  return (
    <main className="min-h-dvh w-full bg-white">
      <section className="min-w-limit max-w-content mx-auto w-full p-4">
        <CareerPageBadge
          jobSearchStatus={resumePage.jobSearchStatus}
          lastEditedTime={resumePage.lastEditedTime}
        />
        <NotionRenderer
          recordMap={resumePage.recordMap}
          rootPageId={idToUuid(NOTION_PAGE_IDS.resume)}
        />
      </section>
    </main>
  );
};

export default ResumePage;
