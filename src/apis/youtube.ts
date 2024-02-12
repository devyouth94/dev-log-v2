import axios from "axios";

import { IYoutubeData } from "~/types/youtube";
import { PLAYLIST_ID } from "~/utils/constants";

export const getYoutubaData = async () => {
  const { data } = await axios.get<IYoutubeData>(
    "https://www.googleapis.com/youtube/v3/playlistItems",
    {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        playlistId: PLAYLIST_ID,
        part: "snippet",
        maxResults: 50,
      },
    },
  );

  return data.items;
};
