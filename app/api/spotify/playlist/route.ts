import { NextResponse } from "next/server";

import { getSpotifyPlaylist, SpotifyError } from "src/apis/spotify";

export const GET = async () => {
  try {
    const playlist = await getSpotifyPlaylist();

    return NextResponse.json(playlist, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    const status = error instanceof SpotifyError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Failed to load playlist.";

    return NextResponse.json({ message }, { status });
  }
};
