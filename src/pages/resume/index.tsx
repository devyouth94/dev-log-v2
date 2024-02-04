import { GetStaticProps, InferGetStaticPropsType } from "next";
import { ExtendedRecordMap } from "notion-types";
import Header from "~/components/shared/Header";
import { NOTION_PAGE_IDS } from "~/utils/constants";
import { notion } from "~/utils/notion";

const Resume = ({
  recordMap,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Header />

      <div className="flex h-dvh w-full items-center justify-center">
        <span className="font-extralight">열심히 준비중입니다!</span>
      </div>

      {/* <NotionRenderer recordMap={recordMap} /> */}
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
  };
}) satisfies GetStaticProps<{
  recordMap: ExtendedRecordMap;
}>;
