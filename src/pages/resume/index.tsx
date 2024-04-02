import { GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { ExtendedRecordMap } from "notion-types";

import Main from "~/components/layouts/main";
import NotionRenderer from "~/components/shared/notion-renderer";

import { METADATA, NOTION_PAGE_IDS } from "~/utils/constants";
import { notion } from "~/utils/notion";

const Resume = ({
  recordMap,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <NextSeo
        title="resume"
        canonical={`${METADATA.meta.url}/resume`}
        openGraph={{
          url: `${METADATA.meta.url}/resume`,
          title: `resume | ${METADATA.meta.title}`,
        }}
      />

      <Main className="notion-resume items-center justify-center">
        <NotionRenderer recordMap={recordMap} />
      </Main>
    </>
  );
};

export default Resume;

export const getStaticProps = (async () => {
  const recordMap = await notion.getPage(NOTION_PAGE_IDS.resume);

  return {
    props: {
      recordMap,
    },
    revalidate: 60,
  };
}) satisfies GetStaticProps<{
  recordMap: ExtendedRecordMap;
}>;
