import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { ExtendedRecordMap, PageBlock } from "notion-types";
import { TableOfContentsEntry, getPageTableOfContents } from "notion-utils";

import Main from "~/components/layouts/main";
import ArticleButton from "~/components/shared/article-button";
import ArticleCover from "~/components/shared/article-cover";
import ArticleNavigation from "~/components/shared/article-navigation";
import ArticleProperties from "~/components/shared/article-properties";
import Comment from "~/components/shared/giscus";
import NotionRenderer from "~/components/shared/notion-renderer";

import { getContentList } from "~/apis/notion";
import { IPostItem } from "~/types/post";
import { METADATA } from "~/utils/constants";
import { getPageBlockList } from "~/utils/data-format";
import { notion } from "~/utils/notion";

const PostDetail = ({
  postItem,
  recordMap,
  toc,
  prevNextPost,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <NextSeo
        title={postItem.title}
        canonical={`${METADATA.meta.url}/post/${postItem.slug}`}
        openGraph={{
          type: "article",
          url: `${METADATA.meta.url}/post/${postItem.slug}`,
          article: {
            publishedTime: new Date(postItem.createDate).toISOString(),
            tags: [...postItem.tags],
          },
        }}
      />

      <ArticleCover thumbnail={postItem.thumbnail} />

      <Main
        mainClassName="bg-white mt-[264px] pt-[1px]"
        className="items-center"
      >
        <ArticleProperties postItem={postItem} />
        <ArticleButton toc={toc} />
        <NotionRenderer recordMap={recordMap} />
        <ArticleNavigation pathname="post" prevNextPost={prevNextPost} />
        <Comment />
      </Main>
    </>
  );
};

export default PostDetail;

export const getStaticPaths = (async () => {
  const postList = await getContentList("post");

  return {
    paths: postList.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  const postList = await getContentList("post");

  const postItem = postList.find((item) => item.slug === params?.slug)!;
  const recordMap = await notion.getPage(postItem.id);

  const pageBlock = getPageBlockList(recordMap);
  const toc = getPageTableOfContents(pageBlock[0] as PageBlock, recordMap).map(
    (item) => ({ ...item, id: item.id.replaceAll(/[-\u2013\u2014]/g, "") }),
  );

  const postIndex = postList.findIndex((item) => item.id === postItem.id);
  const prevNextPost: Record<string, IPostItem | null> = {
    prev: null,
    next: null,
  };

  postList.forEach((item, index) => {
    if (postIndex - 1 === index) {
      prevNextPost["prev"] = item;
    } else if (postIndex + 1 === index) {
      prevNextPost["next"] = item;
    }
  });

  return { props: { postItem, recordMap, toc, prevNextPost }, revalidate: 60 };
}) satisfies GetStaticProps<{
  postItem: IPostItem;
  recordMap: ExtendedRecordMap;
  toc: TableOfContentsEntry[];
  prevNextPost: Record<string, IPostItem | null>;
}>;
