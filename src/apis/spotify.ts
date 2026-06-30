import { type SpotifyPlaylist } from "src/types/spotify";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;

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

type SpotifyPlaylistDetailsResponse = {
  external_urls: {
    spotify: string;
  };
  name: string;
};

type SpotifyPlaylistItemsResponse = {
  items: SpotifyTrackItem[];
  total: number;
};

type SpotifyPlaylistTrack = SpotifyPlaylist["tracks"][number];

type CachedAccessToken = {
  expiresAt: number;
  token: string;
};

let cachedAccessToken: CachedAccessToken | null = null;

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
  const response = await fetch(SPOTIFY_TOKEN_URL, {
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

  if (!response.ok) {
    throw new Error("Failed to request Spotify token.");
  }

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
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const [detailsResponse, itemsResponse] = await Promise.all([
    fetch(
      `${SPOTIFY_API_URL}/playlists/${playlistId}?${new URLSearchParams({
        fields: ["external_urls", "name"].join(","),
        market: "KR",
      }).toString()}`,
      {
        headers,
        next: {
          revalidate: 300,
        },
      },
    ),
    fetch(
      `${SPOTIFY_API_URL}/playlists/${playlistId}/items?${new URLSearchParams({
        fields:
          "total,items(item(id,type,name,duration_ms,artists(name),album(images)))",
        locale: "ko_KR",
        market: "KR",
      }).toString()}`,
      {
        headers,
        next: {
          revalidate: 300,
        },
      },
    ),
  ]);

  if (!detailsResponse.ok) {
    throw new Error("Failed to request Spotify playlist.");
  }

  if (!itemsResponse.ok) {
    throw new Error("Failed to request Spotify playlist items.");
  }

  const playlist =
    (await detailsResponse.json()) as SpotifyPlaylistDetailsResponse;
  const playlistItems =
    (await itemsResponse.json()) as SpotifyPlaylistItemsResponse;
  const tracks = playlistItems.items
    .map(mapPlaylistTrack)
    .filter((track): track is SpotifyPlaylistTrack => Boolean(track));

  return {
    name: playlist.name,
    total: playlistItems.total,
    tracks,
    url: playlist.external_urls.spotify || process.env.SPOTIFY_PLAYLIST_URL || "",
  };
};
