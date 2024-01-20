import {
  CalendarIcon,
  Clock3Icon,
  CornerRightUpIcon,
  ListIcon,
  MessageSquareMoreIcon,
} from "lucide-react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { ExtendedRecordMap, PageBlock } from "notion-types";
import { TableOfContentsEntry, getPageTableOfContents } from "notion-utils";
import { useEffect, useState } from "react";

import Comment from "~/components/shared/Comment";
import Header from "~/components/shared/Header";
import NotionRenderer from "~/components/shared/NotionRenderer";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { getPublicPostList } from "~/apis/notion";
import { IPostItem } from "~/types/post";
import { cn } from "~/utils/className";
import { getPageBlockList } from "~/utils/dataFormat";
import { getRenderedDate } from "~/utils/date";
import getIntersectionObserver from "~/utils/getIntersectionObserver";
import { notion } from "~/utils/notion";

const PostDetail = ({
  postItem,
  recordMap,
  toc,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
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

        <Comment />
      </main>
    </>
  );
};

export default PostDetail;

const TocButton = ({ toc }: { toc: TableOfContentsEntry[] }) => {
  const { replace } = useRouter();

  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState(toc[0].id);

  useEffect(() => {
    const observer = getIntersectionObserver(setCurrentId);
    const els = Array.from(document.querySelectorAll(".notion-h"));

    els.map((content) => {
      observer.observe(content);
    });
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <ListIcon size={14} absoluteStrokeWidth strokeWidth={1} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="text-sm font-extralight">
        {toc.map(({ id, indentLevel, text }) => (
          <div
            key={id}
            onClick={() => {
              replace(`#${id}`);
              setOpen(false);
            }}
            className={cn(
              "py-1 text-gray-400",
              indentLevel === 0 && "font-normal",
              indentLevel === 1 && "border-l pl-3",
              indentLevel === 2 && "border-l pl-6",
              id === currentId && "text-black",
            )}
          >
            {text}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export const getStaticPaths = (async () => {
  const publicPostList = await getPublicPostList();

  return {
    paths: publicPostList.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  const publicPostList = await getPublicPostList();

  const postItem = publicPostList.find((item) => item.slug === params?.slug)!;
  const recordMap = await notion.getPage(postItem.id);

  const pageBlock = getPageBlockList(recordMap);
  const toc = getPageTableOfContents(pageBlock[0] as PageBlock, recordMap).map(
    (item) => ({ ...item, id: item.id.replaceAll(/[-\u2013\u2014]/g, "") }),
  );

  return { props: { postItem, recordMap, toc } };
}) satisfies GetStaticProps<{
  postItem: IPostItem;
  recordMap: ExtendedRecordMap;
  toc: TableOfContentsEntry[];
}>;
