import { type NextRequest } from "next/server";

import {
  getSpotifyRefreshTokenByCode,
  isSpotifyAuthRouteEnabled,
  SPOTIFY_AUTH_STATE_COOKIE,
} from "src/apis/spotify";

const renderHtml = (body: string) => {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><title>Spotify Auth</title></head><body style="font-family: monospace; padding: 24px;">${body}</body></html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
};

export const GET = async (request: NextRequest) => {
  if (!isSpotifyAuthRouteEnabled()) {
    return new Response("Not found", { status: 404 });
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get(SPOTIFY_AUTH_STATE_COOKIE)?.value;

  if (!code || !state || state !== savedState) {
    return renderHtml("<h1>Spotify auth failed</h1><p>Invalid state.</p>");
  }

  const refreshToken = await getSpotifyRefreshTokenByCode(code);

  if (!refreshToken) {
    return renderHtml(
      "<h1>Spotify auth completed</h1><p>No refresh token was returned. Remove this app from your Spotify account access list and try again.</p>",
    );
  }

  return renderHtml(
    `<h1>Spotify refresh token</h1><p>Add this to <code>.env.local</code>:</p><pre style="white-space: pre-wrap;">SPOTIFY_REFRESH_TOKEN=${refreshToken}</pre>`,
  );
};
