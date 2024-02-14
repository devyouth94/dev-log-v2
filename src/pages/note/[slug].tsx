import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { ExtendedRecordMap, PageBlock } from "notion-types";
import { TableOfContentsEntry, getPageTableOfContents } from "notion-utils";

import Main from "~/components/layouts/main";
import ArticleButton from "~/components/shared/article-button";
import ArticleNavigation from "~/components/shared/article-navigation";
import ArticleProperties from "~/components/shared/article-properties";
import Comment from "~/components/shared/giscus";
import NotionRenderer from "~/components/shared/notion-renderer";

import { getContentList } from "~/apis/notion";
import { IPostItem } from "~/types/post";
import { METADATA } from "~/utils/constants";
import { getPageBlockList } from "~/utils/data-format";
import { notion } from "~/utils/notion";

const NoteDetail = ({
  noteItem,
  recordMap,
  toc,
  prevNextNote,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <NextSeo
        title={noteItem.title}
        canonical={`${METADATA.meta.url}/note/${noteItem.slug}`}
        openGraph={{
          type: "article",
          url: `${METADATA.meta.url}/note/${noteItem.slug}`,
          article: {
            publishedTime: new Date(noteItem.createDate).toISOString(),
            tags: [...noteItem.tags],
          },
        }}
      />

      <Main mainClassName="bg-white" className="items-center">
        <ArticleProperties postItem={noteItem} />
        <ArticleButton toc={toc} />
        <NotionRenderer recordMap={recordMap} />
        <ArticleNavigation pathname="post" prevNextPost={prevNextNote} />
        <Comment />
      </Main>
    </>
  );
};

export default NoteDetail;

export const getStaticPaths = (async () => {
  const noteList = await getContentList("note");

  return {
    paths: noteList.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  const noteList = await getContentList("note");

  const noteItem = noteList.find((item) => item.slug === params?.slug)!;
  const recordMap = await notion.getPage(noteItem.id);

  const pageBlock = getPageBlockList(recordMap);
  const toc = getPageTableOfContents(pageBlock[0] as PageBlock, recordMap).map(
    (item) => ({ ...item, id: item.id.replaceAll(/[-\u2013\u2014]/g, "") }),
  );

  const noteIndex = noteList.findIndex((item) => item.id === noteItem.id);
  const prevNextNote: Record<string, IPostItem | null> = {
    prev: null,
    next: null,
  };

  noteList.forEach((item, index) => {
    if (noteIndex - 1 === index) {
      prevNextNote["prev"] = item;
    } else if (noteIndex + 1 === index) {
      prevNextNote["next"] = item;
    }
  });

  return { props: { noteItem, recordMap, toc, prevNextNote }, revalidate: 60 };
}) satisfies GetStaticProps<{
  noteItem: IPostItem;
  recordMap: ExtendedRecordMap;
  toc: TableOfContentsEntry[];
  prevNextNote: Record<string, IPostItem | null>;
}>;
