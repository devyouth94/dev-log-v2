import { type Block, type ExtendedRecordMap } from "notion-types";
import {
  defaultMapImageUrl,
  getBlockValue,
  getPageProperty,
  getTextContent,
  idToUuid,
} from "notion-utils";
import readingTime from "reading-time";

import { type PortfolioEntry } from "src/types/portfolio";
import { type CategoryItem, type Post, type PostStatus } from "src/types/post";

export type JobSearchStatus = "구직중" | "구직 아님";

const isBlock = (block: Block | undefined): block is Block => {
  return !!block;
};

const isPostStatus = (status: string | null): status is PostStatus => {
  return status === "Published" || status === "Draft";
};

const isJobSearchStatus = (
  status: string | null,
): status is JobSearchStatus => {
  return status === "구직중" || status === "구직 아님";
};

const isPostBlock = (block: Block): block is Block => {
  return block.type === "page";
};

const getPageBlockFromRecordMap = (
  recordMap: ExtendedRecordMap,
  pageId: string,
) => {
  const blockId = pageId.includes("-") ? pageId : idToUuid(pageId);
  const pageBlock = getBlockValue(recordMap.block[blockId]);

  return pageBlock?.type === "page" ? pageBlock : null;
};

const getPageRowSelectValue = <T extends string>(
  block: Block,
  isValue: (value: string | null) => value is T,
) => {
  if (!block.properties) return null;

  // ponytail: parent DB schema is absent here, so scan page-row select values directly.
  const value = Object.entries(block.properties)
    .flatMap(([propertyId, property]) =>
      propertyId === "title" || !Array.isArray(property)
        ? []
        : property.flat(2),
    )
    .find((item): item is T => typeof item === "string" && isValue(item));

  return value ?? null;
};

export const getHumanizeReadTime = (time: number): string => {
  if (time < 0.5) {
    return "less than 1 min read";
  }

  if (time < 1.5) {
    return "1 min read";
  }

  return `${Math.ceil(time)} min read`;
};

const getTextContents = (block: Block, recordMap: ExtendedRecordMap) => {
  const data = Object.values(recordMap.block)
    .map(getBlockValue)
    .filter(isBlock)
    .filter(({ type }) =>
      [
        "quote",
        "alias",
        "header",
        "sub_header",
        "sub_sub_header",
        "callout",
        "toggle",
        "to_do",
        "bulleted_list",
        "numbered_list",
        "text",
      ].includes(type),
    )
    .map(({ id, properties }) => [
      id,
      properties?.title
        ?.flat()
        .filter((item: string | string[]) => typeof item === "string")
        .join(""),
    ]);

  const textObject = Object.fromEntries(data);

  return block.content
    ?.map((item) => textObject[item])
    .join(" ")
    .toLowerCase();
};

export const getPostReadTime = (
  recordMap: ExtendedRecordMap,
  rootPageId: string,
) => {
  const rootBlock = getBlockValue(recordMap.block[rootPageId]);
  const contents = rootBlock ? getTextContents(rootBlock, recordMap) : "";
  const rawReadTime = readingTime(contents || "", { wordsPerMinute: 200 });

  return getHumanizeReadTime(rawReadTime.minutes);
};

export const getPageStatusFromRecordMap = (
  recordMap: ExtendedRecordMap,
  pageId: string,
): PostStatus | null => {
  const pageBlock = getPageBlockFromRecordMap(recordMap, pageId);

  return pageBlock ? getPageRowSelectValue(pageBlock, isPostStatus) : null;
};

export const getPageJobSearchStatusFromRecordMap = (
  recordMap: ExtendedRecordMap,
  pageId: string,
): JobSearchStatus | null => {
  const pageBlock = getPageBlockFromRecordMap(recordMap, pageId);

  return pageBlock ? getPageRowSelectValue(pageBlock, isJobSearchStatus) : null;
};

export const getPageLastEditedTimeFromRecordMap = (
  recordMap: ExtendedRecordMap,
  pageId: string,
) => {
  const pageBlock = getPageBlockFromRecordMap(recordMap, pageId);

  return pageBlock?.last_edited_time ?? null;
};

const getPostItem = (
  block: Block,
  recordMap: ExtendedRecordMap,
): Post | null => {
  const createDate = getPageProperty<number | null>(
    "createDate",
    block,
    recordMap,
  );
  const status = getPageProperty<string | null>("status", block, recordMap);
  const title = getPageProperty<string | null>("title", block, recordMap);
  const slug = getPageProperty<string | null>("slug", block, recordMap);

  if (
    typeof createDate !== "number" ||
    !isPostStatus(status) ||
    !title ||
    !slug
  ) {
    return null;
  }

  return {
    category:
      getPageProperty<string | null>("category", block, recordMap) ?? "",
    createDate,
    id: block.id,
    slug,
    status,
    summary: getPageProperty<string | null>("summary", block, recordMap) ?? "",
    thumbnail:
      defaultMapImageUrl(block.format?.page_cover || "", block) ?? null,
    title,
  };
};

export const getPostsFromRecordMap = (recordMap: ExtendedRecordMap) => {
  return Object.values(recordMap.block)
    .map(getBlockValue)
    .filter(isBlock)
    .filter(isPostBlock)
    .map((block) => getPostItem(block, recordMap))
    .filter((post): post is Post => !!post);
};

const getPortfolioCollectionId = (recordMap: ExtendedRecordMap) => {
  const collection = Object.values(recordMap.collection)
    .map(getBlockValue)
    .find((item) => getTextContent(item?.name) === "포트폴리오");

  return collection?.id ?? null;
};

const getPortfolioEntry = (
  block: Block,
  recordMap: ExtendedRecordMap,
): PortfolioEntry | null => {
  const status = getPageProperty<string | null>("status", block, recordMap);
  const title = getPageProperty<string | null>("이름", block, recordMap);
  const slug = getPageProperty<string | null>("slug", block, recordMap);

  if (!isPostStatus(status) || !title || !slug) {
    return null;
  }

  return {
    category: getPageProperty<string | null>("구분", block, recordMap) ?? "",
    featured:
      getPageProperty<boolean | null>("대표 여부", block, recordMap) ?? false,
    id: block.id,
    lastEditedTime: block.last_edited_time,
    period: getPageProperty<number | number[] | null>("기간", block, recordMap),
    slug,
    stacks:
      getPageProperty<string[] | null>("주요 스택", block, recordMap) ?? [],
    status,
    summary:
      getPageProperty<string | null>("한 줄 소개", block, recordMap) ?? "",
    thumbnail:
      defaultMapImageUrl(block.format?.page_cover || "", block) ?? null,
    title,
  };
};

export const getPortfolioEntriesFromRecordMap = (
  recordMap: ExtendedRecordMap,
) => {
  const collectionId = getPortfolioCollectionId(recordMap);

  if (!collectionId) return [];

  return Object.values(recordMap.block)
    .map(getBlockValue)
    .filter(isBlock)
    .filter(
      (block) => block.type === "page" && block.parent_id === collectionId,
    )
    .map((block) => getPortfolioEntry(block, recordMap))
    .filter((entry): entry is PortfolioEntry => !!entry);
};

/**
 * category list를 반환합니다.
 */
export const getCategoryList = (list: string[]): CategoryItem[] => {
  const initial: Record<string, number> = { all: 0 };

  const results = list.reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    acc.all += 1;
    return acc;
  }, initial);

  return Object.entries(results)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count);
};
