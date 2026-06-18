export type SpotifyPlaylist = {
  name: string;
  total: number;
  tracks: {
    albumImageUrl: string | null;
    artists: string;
    duration: string;
    id: string;
    name: string;
  }[];
  url: string;
};
