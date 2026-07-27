import { NextResponse } from "next/server";

import { getSpotifyPlaylist, SpotifyUnavailableError } from "src/apis/spotify";

export const GET = async () => {
  try {
    const playlist = await getSpotifyPlaylist();

    return NextResponse.json(playlist, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Failed to load Spotify playlist.", error);

    return NextResponse.json(
      { message: "spotify is temporarily unavailable" },
      { status: error instanceof SpotifyUnavailableError ? 503 : 500 },
    );
  }
};
