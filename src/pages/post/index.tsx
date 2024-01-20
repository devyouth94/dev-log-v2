import { CalendarIcon, Clock3Icon } from "lucide-react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import qs from "qs";
import { useMemo } from "react";

import Header from "~/components/shared/Header";
import { Badge } from "~/components/ui/badge";

import { getPublicPostList } from "~/apis/notion";
import { ICategoryItem, IPostItem, ITagItem } from "~/types/post";
import { cn } from "~/utils/className";
import { getCategoryList, getTagList } from "~/utils/dataFormat";
import { getRenderedDate } from "~/utils/date";

const Post = ({
  publicPostList,
  categoryList,
  tagList,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { query, push, isReady, replace } = useRouter();
  const { category: categoryQuery, tag: tagQuery } = query;

  const filteredList = useMemo(() => {
    if (!isReady) return publicPostList;

    return publicPostList.filter(
      (item) =>
        (!categoryQuery || categoryQuery === item.category) &&
        (!tagQuery ||
          item.tags.some((tag) => String(tagQuery).split(",").includes(tag))),
    );
  }, [isReady, publicPostList, categoryQuery, tagQuery]);

  const onClickCategory = (category: string) => {
    const newQuery = categoryQuery === category ? {} : { ...query, category };

    replace({
      pathname: "/post",
      query: tagQuery ? { ...newQuery, tag: tagQuery } : newQuery,
    });
  };

  const onClickTag = (tag: string) => {
    const parseQuery = tagQuery ? String(tagQuery).split(",") : [];
    const newQuery = tagQuery?.includes(tag)
      ? parseQuery.filter((item) => item !== tag)
      : [...parseQuery, tag];

    replace({
      pathname: "/post",
      query: qs.stringify(
        categoryQuery
          ? { category: categoryQuery, tag: newQuery }
          : { tag: newQuery },
        { arrayFormat: "comma" },
      ),
    });
  };

  return (
    <>
      <Header />

      <main className="flex min-h-screen flex-col items-center pb-8 pt-16">
        <section className="w-full max-w-[720px] space-y-10 px-4">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              {categoryList.map((item) => (
                <Badge
                  key={item.title}
                  variant={
                    categoryQuery === item.title ? "default" : "secondary"
                  }
                  className="gap-1"
                  onClick={() => onClickCategory(item.title)}
                  hasDeleteButton={categoryQuery === item.title}
                >
                  <span>{item.title}</span>
                  <span className="font-extralight">{item.count}</span>
                </Badge>
              ))}
            </div>

            <div className="flex gap-1">
              {tagList.map((item) => (
                <Badge
                  key={item.title}
                  variant={
                    tagQuery?.includes(item.title) ? "default" : "outline"
                  }
                  className="gap-1"
                  onClick={() => onClickTag(item.title)}
                  hasDeleteButton={tagQuery?.includes(item.title)}
                >
                  <span>{`#${item.title}`}</span>
                  <span className="font-extralight">{item.count}</span>
                </Badge>
              ))}
            </div>
          </div>

          {filteredList?.map((post) => (
            <article
              key={post.id}
              onClick={() => push(`/post/${post.slug}`)}
              className="grid cursor-pointer grid-rows-[200px_40px] saturate-0 transition-all hover:saturate-100"
            >
              <div className="relative flex flex-col justify-between overflow-hidden p-3">
                <Badge
                  className="z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClickCategory(post.category);
                  }}
                >
                  {post.category}
                </Badge>
                <div
                  className={cn(
                    "z-10 flex flex-col gap-1",
                    post.thumbnail && "text-white",
                  )}
                >
                  <span className="text-2xl font-bold">{post.title}</span>
                  <span className="block truncate text-sm">{post.summary}</span>
                </div>
                {post.thumbnail && (
                  <Image
                    src={post.thumbnail}
                    alt={post.thumbnail}
                    sizes="600px"
                    priority
                    fill
                    className="object-cover brightness-50"
                  />
                )}
              </div>

              <div className="flex items-center justify-between text-sm font-light">
                <div className="flex items-center gap-1">
                  {post.tags.map((tag) => (
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
                    <span>{getRenderedDate(post.createDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock3Icon size={14} absoluteStrokeWidth strokeWidth={1} />
                    <span>{post.readTime}</span>
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

export default Post;

export const getStaticProps = (async () => {
  const publicPostList = await getPublicPostList();
  const categoryList = getCategoryList(
    publicPostList.map(({ category }) => category),
  );
  const tagList = getTagList(publicPostList.map(({ tags }) => tags));

  return { props: { publicPostList, categoryList, tagList } };
}) satisfies GetStaticProps<{
  publicPostList: IPostItem[];
  categoryList: ICategoryItem[];
  tagList: ITagItem[];
}>;
