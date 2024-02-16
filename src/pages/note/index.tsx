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

const Note = ({
  noteList,
  categoryList,
  tagList,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [search, setSearch] = useState("");
  const { filteredList } = useFilteredList(noteList, search);

  return (
    <>
      <NextSeo
        title="note"
        canonical={`${METADATA.meta.url}/note`}
        openGraph={{
          url: `${METADATA.meta.url}/note`,
          title: `note | ${METADATA.meta.title}`,
        }}
      />

      <Main className="pt-header">
        {/* tag list */}
        <BadgeContainer>
          <BadgeContainer.Inner>
            {categoryList.map((item) => (
              <BadgeCategory key={item.title} pathname="note" item={item} />
            ))}
          </BadgeContainer.Inner>
          <BadgeContainer.Inner>
            {tagList.map((item) => (
              <BadgeTag key={item.title} pathname="note" item={item} />
            ))}
          </BadgeContainer.Inner>
        </BadgeContainer>

        {/* search */}
        <Input
          placeholder="검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* note list */}
        <MotionContainer className="space-y-5 pt-3">
          {filteredList.map((item) => (
            <CardArticle key={item.id} pathname="note" item={item} />
          ))}
        </MotionContainer>
      </Main>
    </>
  );
};

export default Note;

export const getStaticProps = (async () => {
  const noteList = await getContentList("note");
  const categoryList = getCategoryList(
    noteList.map(({ category }) => category),
  );
  const tagList = getTagList(noteList.map(({ tags }) => tags));

  return { props: { noteList, categoryList, tagList }, revalidate: 60 };
}) satisfies GetStaticProps<{
  noteList: IPostItem[];
  categoryList: ICategoryItem[];
  tagList: ITagItem[];
}>;
