import { type NextRequest, NextResponse } from "next/server";

import {
  isSpotifyAuthRouteEnabled,
  SPOTIFY_AUTH_STATE_COOKIE,
  getSpotifyAuthorizeUrl,
  getSpotifyRedirectUri,
} from "src/apis/spotify";

export const GET = (request: NextRequest) => {
  if (!isSpotifyAuthRouteEnabled()) {
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

  response.cookies.set(SPOTIFY_AUTH_STATE_COOKIE, state, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: redirectUri.startsWith("https://"),
  });

  return response;
};
