import { cache } from "react";
import { type ExtendedRecordMap } from "notion-types";

import { type PostDetailItem } from "src/types/post";
import { NOTION_PAGE_IDS } from "src/utils/constants";
import { getPostReadTime, getPostsFromRecordMap } from "src/utils/data-format";
import { notion } from "src/utils/notion";

type PostDetail = {
  postItem: PostDetailItem;
  recordMap: ExtendedRecordMap;
};

export const getPublishedPosts = cache(async () => {
  const recordMap = await notion.getPage(NOTION_PAGE_IDS.post);
  const postList = getPostsFromRecordMap(recordMap);
  const publishedPosts = postList.filter((post) => post.status === "Published");

  return publishedPosts.sort((a, b) => b.createDate - a.createDate);
});

export const getPostDetail = cache(
  async (slug: string): Promise<PostDetail | null> => {
    const postList = await getPublishedPosts();
    const postItem = postList.find((post) => post.slug === slug);

    if (!postItem) return null;

    const recordMap = await notion.getPage(postItem.id);
    const readTime = getPostReadTime(recordMap, postItem.id);

    return {
      postItem: {
        ...postItem,
        readTime,
      },
      recordMap,
    };
  },
);
