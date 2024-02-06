import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  Clock3Icon,
  CornerRightUpIcon,
  MessageSquareMoreIcon,
} from "lucide-react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import { ExtendedRecordMap, PageBlock } from "notion-types";
import { TableOfContentsEntry, getPageTableOfContents } from "notion-utils";

import Comment from "~/components/shared/Comment";
import Header from "~/components/shared/Header";
import NotionRenderer from "~/components/shared/NotionRenderer";
import TocButton from "~/components/shared/TOC";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

import { getContentList } from "~/apis/notion";
import { IPostItem } from "~/types/post";
import { METADATA } from "~/utils/constants";
import { getPageBlockList } from "~/utils/dataFormat";
import { getRenderedDate } from "~/utils/date";
import { notion } from "~/utils/notion";

const PostDetail = ({
  postItem,
  recordMap,
  toc,
  prevNextPost,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { push } = useRouter();

  const onClickToTop = () => {
    window.scrollTo({ top: 0 });
  };

  const onClickToComment = () => {
    document
      .getElementById("giscus-comment")
      ?.scrollIntoView({ block: "center" });
  };

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

      <Header />

      <section className="fixed top-16 -z-10 h-[200px] w-full">
        {postItem.thumbnail && (
          <Image
            src={postItem.thumbnail}
            alt={postItem.thumbnail}
            sizes="1024px"
            priority
            fill
            className="object-cover object-center brightness-50"
          />
        )}
      </section>

      <main className="relative mt-[264px] flex flex-col items-center bg-white py-8">
        <section className="flex max-w-[720px] flex-col items-center gap-3 px-4 text-center">
          <span className="text-4xl font-black">{postItem.title}</span>

          <div className="flex gap-1">
            <Badge className="cursor-default">{postItem.category}</Badge>
            {postItem.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-default"
              >{`#${tag}`}</Badge>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm font-light">
            <div className="flex items-center gap-1">
              <CalendarIcon size={14} absoluteStrokeWidth strokeWidth={1} />
              <span>{getRenderedDate(postItem.createDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock3Icon size={14} absoluteStrokeWidth strokeWidth={1} />
              <span>{postItem.readTime}</span>
            </div>
          </div>
        </section>

        <div className="sticky right-4 top-16 z-30 flex w-full max-w-[720px] justify-end gap-1 px-4 pt-4">
          <TocButton toc={toc} />

          <Button variant="outline" size="icon" onClick={onClickToTop}>
            <CornerRightUpIcon size={14} absoluteStrokeWidth strokeWidth={1} />
          </Button>

          <Button variant="outline" size="icon" onClick={onClickToComment}>
            <MessageSquareMoreIcon
              size={14}
              absoluteStrokeWidth
              strokeWidth={1}
            />
          </Button>
        </div>

        <NotionRenderer recordMap={recordMap} />

        <section className="grid w-full max-w-[720px] grid-cols-2 gap-1 px-4 py-10">
          <div>
            {prevNextPost["prev"] && (
              <Button
                variant="ghost"
                onClick={() => push(`/post/${prevNextPost["prev"]?.slug}`)}
                className="flex w-full cursor-pointer items-center justify-start text-gray-400"
              >
                <ArrowLeftIcon size={18} absoluteStrokeWidth strokeWidth={1} />
                <span className="text-base font-extralight">
                  {prevNextPost["prev"]?.title}
                </span>
              </Button>
            )}
          </div>
          <div>
            {prevNextPost["next"] && (
              <Button
                variant="ghost"
                onClick={() => push(`/post/${prevNextPost["next"]?.slug}`)}
                className="flex w-full items-center justify-end text-gray-400"
              >
                <span className="text-base font-extralight">
                  {prevNextPost["next"]?.title}
                </span>
                <ArrowRightIcon size={18} absoluteStrokeWidth strokeWidth={1} />
              </Button>
            )}
          </div>
        </section>

        <Comment />
      </main>
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
