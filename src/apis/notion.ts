import { cache } from "react";
import { type ExtendedRecordMap } from "notion-types";

import { type PortfolioEntry } from "src/types/portfolio";
import { type PostDetailItem } from "src/types/post";
import { NOTION_PAGE_IDS } from "src/utils/constants";
import {
  getPageJobSearchStatusFromRecordMap,
  getPageLastEditedTimeFromRecordMap,
  getPageStatusFromRecordMap,
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

export const getPublishedPostBySlug = async (slug: string) => {
  const postList = await getPublishedPosts();

  return postList.find((post) => post.slug === slug) ?? null;
};

export const getResumePage = cache(async () => {
  try {
    const recordMap = await notion.getPage(NOTION_PAGE_IDS.resume);

    return {
      jobSearchStatus: getPageJobSearchStatusFromRecordMap(
        recordMap,
        NOTION_PAGE_IDS.resume,
      ),
      lastEditedTime: getPageLastEditedTimeFromRecordMap(
        recordMap,
        NOTION_PAGE_IDS.resume,
      ),
      recordMap,
      status: getPageStatusFromRecordMap(recordMap, NOTION_PAGE_IDS.resume),
    };
  } catch {
    return null;
  }
});

const getPortfolioSortDate = (entry: PortfolioEntry) => {
  if (Array.isArray(entry.period)) return entry.period[0];

  return entry.period ?? 0;
};

export const getPortfolioPage = cache(async () => {
  const recordMap = await notion.getPage(NOTION_PAGE_IDS.portfolio);
  const status = getPageStatusFromRecordMap(
    recordMap,
    NOTION_PAGE_IDS.portfolio,
  );
  const portfolioList =
    status === "Published" ? getPortfolioEntriesFromRecordMap(recordMap) : [];
  const publishedPortfolioList = portfolioList.filter(
    (entry) => entry.status === "Published",
  );

  return {
    jobSearchStatus: getPageJobSearchStatusFromRecordMap(
      recordMap,
      NOTION_PAGE_IDS.portfolio,
    ),
    lastEditedTime: getPageLastEditedTimeFromRecordMap(
      recordMap,
      NOTION_PAGE_IDS.portfolio,
    ),
    portfolioList: publishedPortfolioList.sort(
      (a, b) => getPortfolioSortDate(b) - getPortfolioSortDate(a),
    ),
    status,
  };
});

export const getPostDetail = cache(
  async (slug: string): Promise<PostDetail | null> => {
    const postItem = await getPublishedPostBySlug(slug);

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
