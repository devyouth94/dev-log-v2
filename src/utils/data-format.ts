import { Block, ExtendedRecordMap } from "notion-types";
import { getPageProperty, uuidToId } from "notion-utils";
import { defaultMapImageUrl } from "react-notion-x";
import readingTime from "reading-time";

import { ICategoryItem, IPostItem, IPostStatus, ITagItem } from "~/types/post";
import { IPlaylistItem, IYoutubeItem } from "~/types/youtube";
import { SCHEMA_LIST } from "~/utils/constants";
import { notion } from "~/utils/notion";

export const getPlayList = (data: IYoutubeItem[]): IPlaylistItem[] => {
  return data
    .map((item) => item.snippet)
    .map(({ title, thumbnails, videoOwnerChannelTitle, publishedAt }) => ({
      thumbnailUrl: thumbnails.high.url,
      artist: videoOwnerChannelTitle.split(" - ")[0],
      title,
      publishedAt,
    }));
};

export const getHumanizeReadTime = (time: number): string => {
  if (time < 0.5) {
    return "1분 미만";
  }

  if (time < 1.5) {
    return "1분";
  }

  return `${Math.ceil(time)}분`;
};

/**
 * block type이 page인 것만 반환합니다.
 */
export const getPageBlockList = (recordMap: ExtendedRecordMap) => {
  return Object.values(recordMap.block)
    .map(({ value }) => value)
    .filter(({ type }) => type === "page");
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
    const tags = (schemaData?.tags as string[]).filter((item) => item.length);

    return {
      id: block.id,
      thumbnail,
      contents,
      readTime,
      ...schemaData,
      tags,
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
 * tag list를 반환합니다.
 */
export const getTagList = (list: string[][]): ITagItem[] => {
  const initial: Record<string, number> = {};

  const results = list.reduce((acc, cur) => {
    cur.forEach((item) => {
      acc[item] = (acc[item] || 0) + 1;
    });
    return acc;
  }, initial);

  return Object.entries(results)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count);
};

/**
 * category list를 반환합니다.
 */
export const getCategoryList = (list: string[]): ICategoryItem[] => {
  const initial: Record<string, number> = {};

  const results = list.reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
  }, initial);

  return Object.entries(results)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count);
};
