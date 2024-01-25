import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  Clock3Icon,
  CornerRightUpIcon,
  MessageSquareMoreIcon,
} from "lucide-react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
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
import { getPageBlockList } from "~/utils/dataFormat";
import { getRenderedDate } from "~/utils/date";
import { notion } from "~/utils/notion";

const NoteDetail = ({
  noteItem,
  recordMap,
  toc,
  prevNextNote,
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
      <Header />

      <main className="relative flex flex-col items-center bg-white py-8 pt-16">
        <section className="flex max-w-[720px] flex-col items-center gap-3 px-4 text-center">
          <span className="text-4xl font-black">{noteItem.title}</span>

          <div className="flex gap-1">
            {noteItem.tags.map((tag) => (
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
              <span>{getRenderedDate(noteItem.createDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock3Icon size={14} absoluteStrokeWidth strokeWidth={1} />
              <span>{noteItem.readTime}</span>
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
            {prevNextNote["prev"] && (
              <Button
                variant="ghost"
                onClick={() => push(`/note/${prevNextNote["prev"]?.slug}`)}
                className="flex w-full cursor-pointer items-center justify-start text-gray-400"
              >
                <ArrowLeftIcon size={18} absoluteStrokeWidth strokeWidth={1} />
                <span className="text-base font-extralight">
                  {prevNextNote["prev"]?.title}
                </span>
              </Button>
            )}
          </div>
          <div>
            {prevNextNote["next"] && (
              <Button
                variant="ghost"
                onClick={() => push(`/note/${prevNextNote["next"]?.slug}`)}
                className="flex w-full items-center justify-end text-gray-400"
              >
                <span className="text-base font-extralight">
                  {prevNextNote["next"]?.title}
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

  return { props: { noteItem, recordMap, toc, prevNextNote } };
}) satisfies GetStaticProps<{
  noteItem: IPostItem;
  recordMap: ExtendedRecordMap;
  toc: TableOfContentsEntry[];
  prevNextNote: Record<string, IPostItem | null>;
}>;
