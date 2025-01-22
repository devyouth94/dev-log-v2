import { type Block, type ExtendedRecordMap } from "notion-types";
import { defaultMapImageUrl, getPageProperty, uuidToId } from "notion-utils";
import readingTime from "reading-time";

import {
  type ICategoryItem,
  type IPostItem,
  type IPostStatus,
} from "src/types/post";
import { SCHEMA_LIST } from "src/utils/constants";
import { notion } from "src/utils/notion";

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
    .map(({ value }) => value)
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

/**
 * block type이 page인 것만 반환합니다.
 */
export const getPageBlockList = (recordMap: ExtendedRecordMap) => {
  return Object.values(recordMap.block)
    .map(({ value }) => value)
    .filter(({ type }) => type === "page");
};

/**
 * page block list를 렌더링에 필요한 데이터 형태로 가공합니다.
 */
export const getPostList = async (
  recordMap: ExtendedRecordMap,
  blockList: Block[],
) => {
  const list = blockList.map(async (block) => {
    const blockRecordMap = await notion.getPage(uuidToId(block.id));

    const thumbnail = defaultMapImageUrl(block.format?.page_cover || "", block);
    const contents = getTextContents(block, blockRecordMap);
    const rawReadTime = readingTime(contents || "", { wordsPerMinute: 200 });
    const readTime = getHumanizeReadTime(rawReadTime.minutes);
    const schemaData = Object.fromEntries(
      SCHEMA_LIST.map((property) => [
        property,
        getPageProperty(property, block, recordMap),
      ]),
    );

    return {
      id: block.id,
      thumbnail,
      contents,
      readTime,
      ...schemaData,
    };
  });

  return (await Promise.all(list)) as IPostItem[];
};

/**
 * status가 public인 data만 반환합니다.
 */
export const getPublicList = <T extends { status: IPostStatus }>(list: T[]) => {
  return list.filter(({ status }) => status === "Public");
};

/**
 * category list를 반환합니다.
 */
export const getCategoryList = (list: string[]): ICategoryItem[] => {
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
