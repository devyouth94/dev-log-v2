export type ISnippet = {
  title: string;
  publishedAt: string;
  thumbnails: {
    high: {
      url: string;
      width: number;
      height: number;
    };
  };
  videoOwnerChannelTitle: string;
};

export type IYoutubeItem = { snippet: ISnippet };
export type IYoutubeData = {
  items: IYoutubeItem[];
};

export type IPlaylistItem = {
  thumbnailUrl: string;
  artist: string;
  title: string;
  publishedAt: string;
};
