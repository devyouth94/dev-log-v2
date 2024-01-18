import { format } from "date-fns";
import { IPlaylistItem } from "~/types/youtube";

export const getRecentUpdatedDate = (data: IPlaylistItem[]) => {
  const dateMap = data.map(({ publishedAt }) =>
    new Date(publishedAt).getTime(),
  );
  const latestDate = new Date(Math.max(...dateMap));

  return format(latestDate, "yyyy. MM. dd");
};
