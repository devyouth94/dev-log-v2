import { type SpotifyPlaylist } from "src/types/spotify";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";
const SPOTIFY_RETRY_DELAYS_MS = [250, 750];
const SPOTIFY_RETRYABLE_STATUSES = new Set([502, 503, 504]);
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;

export class SpotifyUnavailableError extends Error {}

type SpotifyAccessTokenResponse = {
  access_token: string;
  expires_in: number;
};

type SpotifyImage = {
  url: string;
};

type SpotifyTrackItem = {
  item: {
    album: {
      images: SpotifyImage[];
    };
    artists: { name: string }[];
    duration_ms: number;
    id: string;
    name: string;
    type: string;
  } | null;
};

type SpotifyPlaylistResponse = {
  external_urls: {
    spotify: string;
  };
  items: {
    items: SpotifyTrackItem[];
    total: number;
  };
  name: string;
};

type SpotifyPlaylistTrack = SpotifyPlaylist["tracks"][number];

type CachedAccessToken = {
  expiresAt: number;
  token: string;
};

let cachedAccessToken: CachedAccessToken | null = null;

const fetchSpotify = async (...args: Parameters<typeof fetch>) => {
  for (let attempt = 0; attempt <= SPOTIFY_RETRY_DELAYS_MS.length; attempt++) {
    try {
      const response = await fetch(...args);

      if (
        !SPOTIFY_RETRYABLE_STATUSES.has(response.status) ||
        attempt === SPOTIFY_RETRY_DELAYS_MS.length
      ) {
        return response;
      }
    } catch (error) {
      if (attempt === SPOTIFY_RETRY_DELAYS_MS.length) {
        throw new SpotifyUnavailableError(
          "Spotify request failed after retries.",
          { cause: error },
        );
      }
    }

    await new Promise((resolve) =>
      setTimeout(resolve, SPOTIFY_RETRY_DELAYS_MS[attempt]),
    );
  }

  throw new SpotifyUnavailableError("Spotify request failed after retries.");
};

const getSpotifyResponseError = async (
  response: Response,
  resource: "playlist" | "token",
) => {
  const ErrorType = SPOTIFY_RETRYABLE_STATUSES.has(response.status)
    ? SpotifyUnavailableError
    : Error;

  return new ErrorType(
    `Spotify ${resource} request failed (${response.status}): ${await response.text()}`,
  );
};

const getSpotifyPlaylistId = () => {
  const playlistId =
    process.env.SPOTIFY_PLAYLIST_ID ||
    process.env.SPOTIFY_PLAYLIST_URL?.match(/playlist\/([^?/#]+)/)?.[1];

  if (!playlistId) {
    throw new Error("Spotify playlist ID is missing.");
  }

  return playlistId;
};

const requestSpotifyAccessToken = async () => {
  const now = Date.now();

  if (
    cachedAccessToken &&
    cachedAccessToken.expiresAt - TOKEN_EXPIRY_BUFFER_MS > now
  ) {
    return cachedAccessToken.token;
  }

  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify client credentials are missing.");
  }

  if (!refreshToken) {
    throw new Error("Spotify refresh token is missing.");
  }

  const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );
  const response = await fetchSpotify(SPOTIFY_TOKEN_URL, {
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!response.ok) throw await getSpotifyResponseError(response, "token");

  const token = (await response.json()) as SpotifyAccessTokenResponse;

  cachedAccessToken = {
    expiresAt: now + token.expires_in * 1000,
    token: token.access_token,
  };

  return token.access_token;
};

const formatDuration = (durationMs: number) => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const mapPlaylistTrack = (
  item: SpotifyTrackItem,
): SpotifyPlaylistTrack | null => {
  const track = item.item;

  if (!track || track.type !== "track") {
    return null;
  }

  const albumImage = track.album.images.at(-1) || track.album.images[0];

  return {
    albumImageUrl: albumImage?.url || null,
    artists: track.artists.map((artist) => artist.name).join(", "),
    duration: formatDuration(track.duration_ms),
    id: track.id,
    name: track.name,
  };
};

export const getSpotifyPlaylist = async (): Promise<SpotifyPlaylist> => {
  const accessToken = await requestSpotifyAccessToken();
  const playlistId = getSpotifyPlaylistId();
  const response = await fetchSpotify(
    `${SPOTIFY_API_URL}/playlists/${playlistId}?${new URLSearchParams({
      fields:
        "external_urls,name,items(total,items(item(id,type,name,duration_ms,artists(name),album(images))))",
      market: "KR",
    })}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: 300,
      },
    },
  );

  if (!response.ok) throw await getSpotifyResponseError(response, "playlist");

  const playlist = (await response.json()) as SpotifyPlaylistResponse;
  const tracks = playlist.items.items
    .map(mapPlaylistTrack)
    .filter((track): track is SpotifyPlaylistTrack => Boolean(track));

  return {
    name: playlist.name,
    total: playlist.items.total,
    tracks,
    url:
      playlist.external_urls.spotify || process.env.SPOTIFY_PLAYLIST_URL || "",
  };
};
