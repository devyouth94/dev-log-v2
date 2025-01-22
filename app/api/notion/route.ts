import { type ExtendedRecordMap } from "notion-types";

import { notion } from "src/utils/notion";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId");

  if (!pageId) {
    return Response.json({ error: "pageId is required" }, { status: 400 });
  }

  try {
    const recordMap: ExtendedRecordMap = await notion.getPage(pageId);

    return Response.json(recordMap);
    // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch Notion page" },
      { status: 500 },
    );
  }
};
