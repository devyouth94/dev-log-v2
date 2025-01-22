import { type ExtendedRecordMap } from "notion-types";

import { NOTION_PAGE_IDS } from "src/utils/constants";
import {
  getPageBlockList,
  getPostList,
  getPublicList,
} from "src/utils/data-format";

export const getContentList = async () => {
  //1. 노션 페이지 조회
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/notion?pageId=${NOTION_PAGE_IDS.post}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    },
  );

  const recordMap: ExtendedRecordMap = await response.json();

  //2. 페이지 블록 필터
  const pageBlockList = getPageBlockList(recordMap);

  //3. 데이터 가공
  const postList = await getPostList(recordMap, pageBlockList);

  //4. 퍼블릭 포스트 필터
  const publicList = getPublicList(postList);

  return publicList.sort((a, b) => b.createDate - a.createDate);
};
