import { GetStaticProps, InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { useState } from "react";

import Main from "~/components/layouts/main";
import BadgeCategory from "~/components/shared/badge-category";
import BadgeContainer from "~/components/shared/badge-container";
import BadgeTag from "~/components/shared/badge-tag";
import CardArticle from "~/components/shared/card-article";
import MotionContainer from "~/components/shared/motion-container";
import { Input } from "~/components/ui/input";

import { getContentList } from "~/apis/notion";
import useFilteredList from "~/hooks/use-filtered-list";
import { ICategoryItem, IPostItem, ITagItem } from "~/types/post";
import { METADATA } from "~/utils/constants";
import { getCategoryList, getTagList } from "~/utils/data-format";

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
        openGraph={{
          url: `${METADATA.meta.url}/post`,
          title: `post | ${METADATA.meta.title}`,
        }}
      />

      <Main className="pt-header">
        {/* tag list */}
        <BadgeContainer>
          <BadgeContainer.Inner>
            {categoryList.map((item) => (
              <BadgeCategory key={item.title} pathname="post" item={item} />
            ))}
          </BadgeContainer.Inner>
          <BadgeContainer.Inner>
            {tagList.map((item) => (
              <BadgeTag key={item.title} pathname="post" item={item} />
            ))}
          </BadgeContainer.Inner>
        </BadgeContainer>

        {/* search */}
        <Input
          placeholder="검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* post list */}
        <MotionContainer className="space-y-5">
          {filteredList.map((item) => (
            <CardArticle key={item.id} pathname="post" item={item} />
          ))}
        </MotionContainer>
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
