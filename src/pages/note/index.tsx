import { CalendarIcon, Clock3Icon } from "lucide-react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import qs from "qs";
import { useMemo } from "react";

import Header from "~/components/shared/Header";
import { Badge } from "~/components/ui/badge";

import { getContentList } from "~/apis/notion";
import { IPostItem, ITagItem } from "~/types/post";
import { getTagList } from "~/utils/dataFormat";
import { getRenderedDate } from "~/utils/date";

const Note = ({
  noteList,
  tagList,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { query, push, isReady, replace } = useRouter();
  const { tag: tagQuery } = query;

  const filteredList = useMemo(() => {
    if (!isReady) return noteList;

    return noteList.filter(
      (item) =>
        !tagQuery ||
        item.tags.some((tag) => String(tagQuery).split(",").includes(tag)),
    );
  }, [isReady, noteList, tagQuery]);

  const onClickTag = (tag: string) => {
    const parseQuery = tagQuery ? String(tagQuery).split(",") : [];
    const newQuery = tagQuery?.includes(tag)
      ? parseQuery.filter((item) => item !== tag)
      : [...parseQuery, tag];

    replace({
      pathname: "/note",
      query: qs.stringify(
        { tag: newQuery },

        { arrayFormat: "comma" },
      ),
    });
  };

  return (
    <>
      <Header />

      <main className="flex min-h-screen flex-col items-center pb-8 pt-16">
        <section className="w-full max-w-[720px] space-y-10 px-4">
          <div className="flex gap-1">
            {tagList.map((item) => (
              <Badge
                key={item.title}
                variant={tagQuery?.includes(item.title) ? "default" : "outline"}
                className="gap-1"
                onClick={() => onClickTag(item.title)}
                hasDeleteButton={tagQuery?.includes(item.title)}
              >
                <span>{`#${item.title}`}</span>
                <span className="font-extralight">{item.count}</span>
              </Badge>
            ))}
          </div>

          {filteredList?.map((note) => (
            <article
              key={note.id}
              onClick={() => push(`/note/${note.slug}`)}
              className="grid cursor-pointer grid-rows-[auto_40px] saturate-0 transition-all hover:saturate-100"
            >
              <div className="relative flex flex-col justify-end gap-1 overflow-hidden">
                <span className="text-2xl font-bold">{note.title}</span>
              </div>

              <div className="flex items-center justify-between text-sm font-light">
                <div className="flex items-center gap-1">
                  {note.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClickTag(tag);
                      }}
                    >
                      {`#${tag}`}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <CalendarIcon
                      size={14}
                      absoluteStrokeWidth
                      strokeWidth={1}
                    />
                    <span>{getRenderedDate(note.createDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock3Icon size={14} absoluteStrokeWidth strokeWidth={1} />
                    <span>{note.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
};

export default Note;

export const getStaticProps = (async () => {
  const noteList = await getContentList("note");
  const tagList = getTagList(noteList.map(({ tags }) => tags));

  return { props: { noteList, tagList } };
}) satisfies GetStaticProps<{
  noteList: IPostItem[];
  tagList: ITagItem[];
}>;
