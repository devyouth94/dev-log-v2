import { NOTION_PAGE_IDS } from "~/utils/constants";
import {
  getPageBlockList,
  getPostList,
  getPublicList,
} from "~/utils/dataFormat";
import { notion } from "~/utils/notion";

export const getPublicPostList = async () => {
  //1. 노션 페이지 조회
  const recordMap = await notion.getPage(NOTION_PAGE_IDS.post);

  //2. 페이지 블록 필터
  const pageBlockList = getPageBlockList(recordMap);

  //3. 데이터 가공
  const postList = getPostList(recordMap, pageBlockList);

  //4. 퍼블릭 포스트 필터
  const publicPostList = getPublicList(postList);

  return publicPostList.sort((a, b) => b.createDate - a.createDate);
};