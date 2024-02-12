import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";

import Icon from "~/components/shared/icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";

import { IPlaylistItem } from "~/types/youtube";
import { PLAYLIST_ID } from "~/utils/constants";
import { getRecentUpdatedDate } from "~/utils/date";

type IProps = {
  playlist: IPlaylistItem[];
};

const Footer = ({ playlist }: IProps) => {
  return (
    <footer className="fixed inset-x-0 bottom-0 flex h-footer min-w-[375px] items-center justify-between px-4 font-roboto text-sm text-white md:px-8">
      <Popover>
        <PopoverTrigger asChild>
          <section className="flex cursor-pointer items-center gap-1">
            <Icon name="Disc3" className="animate-spin" />
            <span>playlist</span>
          </section>
        </PopoverTrigger>

        <PopoverContent className="w-[280px]">
          <section className="flex items-center justify-between pb-3 text-gray-500">
            <span>{`updated: ${getRecentUpdatedDate(playlist)}`}</span>
            <a
              href={`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`}
              target="_blank"
              className="flex items-end justify-end gap-1 hover:underline"
            >
              <span>go to playlist</span>
              <Icon name="ArrowUpRight" />
            </a>
          </section>

          <ScrollArea className="h-[260px]">
            {playlist.map(({ thumbnailUrl, artist, title }, index) => (
              <article
                key={index}
                className="grid h-12 grid-cols-[32px_auto] items-center gap-3"
              >
                <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full">
                  <div className="absolute z-[2] size-1 rounded-full bg-slate-200" />
                  <div className="absolute z-[1] size-3 rounded-full bg-slate-800" />
                  <Image
                    src={thumbnailUrl}
                    alt={thumbnailUrl}
                    sizes="120px"
                    fill
                    className="scale-[1.4] object-cover"
                  />
                </div>

                <div className="min-w-0 truncate">{`${artist} - ${title}`}</div>
              </article>
            ))}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <section className="flex items-center gap-1">
        <span className="hidden md:block">{`ⓒ 2024,`}</span>
        <a
          target="_blank"
          href="https://github.com/devyouth94"
          className="flex items-center gap-1 hover:underline"
        >
          <span>devyouth94</span>
          <GitHubLogoIcon width={16} height={16} />
        </a>
      </section>
    </footer>
  );
};

export default Footer;
