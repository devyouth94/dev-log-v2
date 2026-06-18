import { cache } from "react";
import { type ExtendedRecordMap } from "notion-types";

import { type PortfolioEntry } from "src/types/portfolio";
import { type PostDetailItem } from "src/types/post";
import { NOTION_PAGE_IDS } from "src/utils/constants";
import {
  getPortfolioEntriesFromRecordMap,
  getPostReadTime,
  getPostsFromRecordMap,
} from "src/utils/data-format";
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

export const getResumePage = cache(async () => {
  try {
    return await notion.getPage(NOTION_PAGE_IDS.resume);
  } catch {
    return null;
  }
});

const getPortfolioSortDate = (entry: PortfolioEntry) => {
  if (Array.isArray(entry.period)) return entry.period[0];

  return entry.period ?? 0;
};

export const getPublishedPortfolioEntries = cache(async () => {
  const recordMap = await notion.getPage(NOTION_PAGE_IDS.portfolio);
  const portfolioList = getPortfolioEntriesFromRecordMap(recordMap);
  const publishedPortfolioList = portfolioList.filter(
    (entry) => entry.status === "Published",
  );

  return publishedPortfolioList.sort(
    (a, b) => getPortfolioSortDate(b) - getPortfolioSortDate(a),
  );
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
