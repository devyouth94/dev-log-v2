import { randomUUID } from "node:crypto";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_AUTH_SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");
const DEFAULT_REDIRECT_URI = "http://127.0.0.1:3000/api/spotify/callback";

const getRequiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing.`);
  }

  return value;
};

const requestRefreshToken = async (code, redirectUri) => {
  const clientId = getRequiredEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = getRequiredEnv("SPOTIFY_CLIENT_SECRET");
  const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to request Spotify token. (${response.status})\n${await response.text()}`,
    );
  }

  const token = await response.json();

  if (!token.refresh_token) {
    throw new Error(
      "No refresh token was returned. Remove this app from your Spotify account access list and try again.",
    );
  }

  return token.refresh_token;
};

const main = async () => {
  const clientId = getRequiredEnv("SPOTIFY_CLIENT_ID");
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || DEFAULT_REDIRECT_URI;
  const state = randomUUID();
  const authUrl = `${SPOTIFY_AUTH_URL}?${new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SPOTIFY_AUTH_SCOPES,
    state,
  }).toString()}`;
  const rl = createInterface({ input, output });

  console.log("Open this URL and approve Spotify access:");
  console.log(authUrl);
  console.log("");
  console.log("The redirect page may fail to load. Paste the final URL here.");

  try {
    const redirectedUrl = await rl.question("Redirected URL: ");
    const url = new URL(redirectedUrl.trim());
    const code = url.searchParams.get("code");
    const returnedState = url.searchParams.get("state");

    if (!code || returnedState !== state) {
      throw new Error("Invalid Spotify redirect URL.");
    }

    const refreshToken = await requestRefreshToken(code, redirectUri);

    console.log("");
    console.log("Add this to .env.local:");
    console.log(`SPOTIFY_REFRESH_TOKEN=${refreshToken}`);
  } finally {
    rl.close();
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
