import { type NextRequest } from "next/server";

import { requestSpotifyTokenByCode } from "src/apis/spotify";

const STATE_COOKIE = "spotify_oauth_state";

const isAuthRouteEnabled = () => {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.SPOTIFY_ENABLE_AUTH_ROUTES === "true"
  );
};

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
  if (!isAuthRouteEnabled()) {
    return new Response("Not found", { status: 404 });
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get(STATE_COOKIE)?.value;

  if (!code || !state || state !== savedState) {
    return renderHtml("<h1>Spotify auth failed</h1><p>Invalid state.</p>");
  }

  const token = await requestSpotifyTokenByCode(code);

  if (!token.refresh_token) {
    return renderHtml(
      "<h1>Spotify auth completed</h1><p>No refresh token was returned. Remove this app from your Spotify account access list and try again.</p>",
    );
  }

  return renderHtml(
    `<h1>Spotify refresh token</h1><p>Add this to <code>.env.local</code>:</p><pre style="white-space: pre-wrap;">SPOTIFY_REFRESH_TOKEN=${token.refresh_token}</pre>`,
  );
};
