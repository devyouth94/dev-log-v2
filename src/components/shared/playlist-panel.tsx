"use client";

import { Popover } from "@base-ui/react/popover";
import Image from "next/image";
import { useEffect, useState } from "react";

import Icon from "src/components/shared/icon";
import { type SpotifyPlaylist } from "src/apis/spotify";
import { cn } from "src/utils/class-name";

type PlaylistState =
  | { data: null; error: null; status: "idle" | "loading" }
  | { data: null; error: string; status: "error" }
  | { data: SpotifyPlaylist; error: null; status: "success" };

const INITIAL_STATE: PlaylistState = {
  data: null,
  error: null,
  status: "idle",
};

const PlaylistPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [playlistState, setPlaylistState] =
    useState<PlaylistState>(INITIAL_STATE);

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen);
  };

  useEffect(() => {
    if (!isOpen || playlistState.status !== "idle") {
      return;
    }

    const controller = new AbortController();

    const loadPlaylist = async () => {
      setPlaylistState({ data: null, error: null, status: "loading" });

      try {
        const response = await fetch("/api/spotify/playlist", {
          signal: controller.signal,
        });
        const payload = (await response.json()) as
          | SpotifyPlaylist
          | { message: string };

        if (!response.ok) {
          throw new Error(
            "message" in payload ? payload.message : "Failed to load playlist.",
          );
        }

        setPlaylistState({
          data: payload as SpotifyPlaylist,
          error: null,
          status: "success",
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setPlaylistState({
          data: null,
          error:
            error instanceof Error ? error.message : "Failed to load playlist.",
          status: "error",
        });
      }
    };

    void loadPlaylist();

    return () => controller.abort();
  }, [isOpen, playlistState.status]);

  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange} modal={false}>
      <Popover.Trigger
        aria-label="playlist"
        className="font-roboto fixed top-7 right-8 z-50 flex size-8 items-center justify-center gap-1 text-xs text-white mix-blend-difference md:top-8 md:size-auto"
      >
        <span className="hidden hover:underline md:inline">playlist</span>
        <Icon name="Disc3" className="animate-spin" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          className="z-50"
        >
          <Popover.Popup
            render={<aside />}
            className="font-roboto md:w-limit w-[calc(100vw-64px)] max-w-sm border border-black bg-white text-sm text-black"
          >
            <header className="flex items-center justify-between border-b border-black px-3 py-2 uppercase">
              <Popover.Title className="min-w-0 truncate text-xs">
                {playlistState.data?.name || "playlist"}
              </Popover.Title>
              <Popover.Close
                aria-label="close playlist"
                className="flex size-6 items-center justify-center hover:bg-gray-100"
              >
                <Icon name="X" size={14} />
              </Popover.Close>
            </header>

            <div className="max-h-[min(70vh,24rem)] overflow-y-auto">
              {playlistState.status === "loading" && (
                <p className="px-3 py-4 text-gray-500">loading playlist</p>
              )}

              {playlistState.status === "error" && (
                <p className="px-3 py-4 text-gray-500">{playlistState.error}</p>
              )}

              {playlistState.status === "success" && (
                <ol className="divide-y divide-gray-200">
                  {playlistState.data.tracks.map((track, index) => (
                    <li key={track.id}>
                      <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100">
                        <span className="w-5 shrink-0 text-xs text-gray-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="relative flex size-[35px] shrink-0 items-center justify-center overflow-hidden bg-gray-100 text-gray-400">
                          {track.albumImageUrl ? (
                            <Image
                              src={track.albumImageUrl}
                              alt=""
                              width={35}
                              height={35}
                              className="size-[35px] object-cover"
                            />
                          ) : (
                            <Icon name="Disc3" size={16} />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{track.name}</span>
                          <span className="block truncate text-xs text-gray-500">
                            {track.artists}
                          </span>
                        </span>
                        <span className="text-xs text-gray-500">
                          {track.duration}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <footer
              className={cn(
                "flex items-center justify-between border-t border-black px-3 py-2 text-xs uppercase",
                !playlistState.data && "text-gray-500",
              )}
            >
              <span>
                {playlistState.data
                  ? `${playlistState.data.total} tracks`
                  : "spotify"}
              </span>
              {playlistState.data && (
                <a
                  href={playlistState.data.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  open in spotify
                  <Icon name="ArrowUpRight" size={14} />
                </a>
              )}
            </footer>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default PlaylistPanel;
