import { format } from "date-fns";
import { IPlaylistItem } from "~/types/youtube";

export const getRecentUpdatedDate = (data: IPlaylistItem[]) => {
  const dateMap = data.map(({ publishedAt }) =>
    new Date(publishedAt).getTime(),
  );
  const latestDate = new Date(Math.max(...dateMap));

  return format(latestDate, "yyyy. MM. dd");
};

export const getRenderedDate = (input: string | number) => {
  const date = new Date(input);

  return format(date, "yyyy년 MM월 dd일");
};
