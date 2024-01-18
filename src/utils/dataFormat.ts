import { IPlaylistItem, IYoutubeItem } from "~/types/youtube";

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
