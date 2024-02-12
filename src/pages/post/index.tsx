import { GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { useState } from "react";

import Main from "~/components/layouts/main";
import ArticleItem from "~/components/shared/article-item";
import BadgeCategory from "~/components/shared/badge-category";
import BadgeTag from "~/components/shared/badge-tag";
import { Input } from "~/components/ui/input";

import { getContentList } from "~/apis/notion";
import useFilteredList from "~/hooks/use-filtered-list";
import { ICategoryItem, IPostItem, ITagItem } from "~/types/post";
import { METADATA } from "~/utils/constants";
import { getCategoryList, getTagList } from "~/utils/dataFormat";

const Post = ({
  postList,
  categoryList,
  tagList,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [search, setSearch] = useState("");
  const { filteredList } = useFilteredList(postList, search);

  return (
    <>
      <NextSeo
        title="post"
        canonical={`${METADATA.meta.url}/post`}
        openGraph={{ url: `${METADATA.meta.url}/post` }}
      />

      <Main>
        {/* tag list */}
        <section className="flex flex-col gap-1">
          <div className="flex flex-wrap gap-1">
            {categoryList.map((item) => (
              <BadgeCategory key={item.title} pathname="post" item={item} />
            ))}
          </div>
          <div className="flex flex-wrap gap-1">
            {tagList.map((item) => (
              <BadgeTag key={item.title} pathname="post" item={item} />
            ))}
          </div>
        </section>

        {/* search */}
        <Input
          placeholder="검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* post list */}
        <section className="space-y-5">
          {filteredList.map((item) => (
            <ArticleItem key={item.id} pathname="post" item={item} />
          ))}
        </section>
      </Main>
    </>
  );
};

export default Post;

export const getStaticProps = (async () => {
  const postList = await getContentList("post");
  const categoryList = getCategoryList(
    postList.map(({ category }) => category),
  );
  const tagList = getTagList(postList.map(({ tags }) => tags));

  return { props: { postList, categoryList, tagList }, revalidate: 60 };
}) satisfies GetStaticProps<{
  postList: IPostItem[];
  categoryList: ICategoryItem[];
  tagList: ITagItem[];
}>;
