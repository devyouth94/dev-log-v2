import { GitHubLogoIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { format } from "date-fns";
import { ArrowUpRightIcon, Disc3Icon } from "lucide-react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";

import Scene from "~/components/home/Scene";
import Header from "~/components/shared/Header";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";

import { IPlaylistItem, IYoutubeData } from "~/types/youtube";
import { PLAYLIST_ID } from "~/utils/constants";

const Index = ({
  playlist,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="bg-black">
      <Header variants="light" />
      <Scene />

      <footer className="font-roboto fixed bottom-0 left-0 right-0 flex h-16 items-center justify-between px-8 text-sm font-extralight text-white">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex cursor-pointer items-center gap-1">
              <Disc3Icon
                size={14}
                absoluteStrokeWidth
                strokeWidth={1}
                className="animate-spin"
              />
              <span>coding playlist</span>
            </div>
          </PopoverTrigger>

          <PopoverContent align="start" sideOffset={10}>
            <div>
              <div className="flex items-center justify-between pb-2 text-xs font-extralight">
                <span className="text-gray-400">{`updated: ${playlist[0].publishedAt}`}</span>

                <a
                  href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
                  target="_blank"
                  className="flex items-center justify-end gap-1 hover:underline"
                >
                  <span>go to playlist</span>
                  <ArrowUpRightIcon
                    size={16}
                    absoluteStrokeWidth
                    strokeWidth={1}
                  />
                </a>
              </div>

              <ScrollArea className="h-[200px]">
                {playlist.map(({ thumbnailUrl, artist, title }, index) => (
                  <div
                    key={index}
                    className="grid h-10 grid-cols-[32px_auto] items-center gap-3"
                  >
                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                      <Image
                        src={thumbnailUrl}
                        alt={thumbnailUrl}
                        sizes="32px"
                        fill
                        className="scale-150 object-cover"
                      />
                    </div>

                    <div className="min-w-0 truncate text-sm font-extralight">{`${artist} - ${title}`}</div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-3">
          <span>{`ⓒ 2024, devyouth94`}</span>
          <a target="_blank" href="https://github.com/devyouth94">
            <GitHubLogoIcon width={18} height={18} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;

export const getStaticProps = (async () => {
  const { data } = await axios.get<IYoutubeData>(
    "https://www.googleapis.com/youtube/v3/playlistItems",
    {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        playlistId: PLAYLIST_ID,
        part: "snippet",
        maxResults: 10,
      },
    },
  );

  const playlist: IPlaylistItem[] = data.items
    .map((item) => item.snippet)
    .map(({ title, thumbnails, videoOwnerChannelTitle, publishedAt }) => ({
      thumbnailUrl: thumbnails.high.url,
      artist: videoOwnerChannelTitle.split(" - ")[0],
      title,
      publishedAt: format(new Date(publishedAt), "yyyy. MM. dd"),
    }));

  return {
    props: {
      playlist,
    },
    revalidate: 60,
  };
}) satisfies GetStaticProps<{ playlist: IPlaylistItem[] }>;
