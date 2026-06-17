import { type NextRequest, NextResponse } from "next/server";

import {
  getSpotifyAuthorizeUrl,
  getSpotifyRedirectUri,
} from "src/apis/spotify";

const STATE_COOKIE = "spotify_oauth_state";

const isAuthRouteEnabled = () => {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.SPOTIFY_ENABLE_AUTH_ROUTES === "true"
  );
};

export const GET = (request: NextRequest) => {
  if (!isAuthRouteEnabled()) {
    return new Response("Not found", { status: 404 });
  }

  const redirectUri = getSpotifyRedirectUri();
  const redirectUrl = new URL(redirectUri);
  const requestHost = request.headers.get("host");

  if (requestHost && requestHost !== redirectUrl.host) {
    return NextResponse.redirect(`${redirectUrl.origin}/api/spotify/authorize`);
  }

  const state = crypto.randomUUID();
  const response = NextResponse.redirect(getSpotifyAuthorizeUrl(state));

  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: redirectUri.startsWith("https://"),
  });

  return response;
};
