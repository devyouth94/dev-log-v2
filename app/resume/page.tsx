import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { idToUuid } from "notion-utils";

import { getResumePage } from "src/apis/notion";
import NotionRenderer from "src/components/shared/notion-renderer";
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
  const recordMap = await getResumePage();

  if (!recordMap) return notFound();

  return (
    <main className="min-h-dvh w-full bg-white">
      <section className="min-w-limit max-w-content mx-auto w-full p-4">
        <NotionRenderer
          recordMap={recordMap}
          rootPageId={idToUuid(NOTION_PAGE_IDS.resume)}
        />
      </section>
    </main>
  );
};

export default ResumePage;
