"use server";
import { MutationFunction } from "@tanstack/react-query";
import { search } from "fast-fuzzy";
import chunk from "lodash/chunk";
import { notFound } from "next/navigation";
import { getSpotifyApi } from "../app/sp";
import { getTokenFromCookie } from "../app/user";
export const refreshAccessToken: Mutation<"auth.refresh"> = async () => {
  // await trpc.auth.refresh.mutate();
};

export const getCurrentUser: Query<"auth.me"> = async ({ signal }) => {
  // const user = await trpc.auth.me.query(undefined, {
  //   signal,
  // });
  // return user;
};

export const getRecommendedTracks = async (trackIds, artistIds, attributes) => {
  const token = await getTokenFromCookie();
  if (!token) {
    notFound();
  }

  const spotifyApi = getSpotifyApi(token.accessToken);

  const songs = await spotifyApi.getRecommendations({
    limit: 100,
    min_acousticness: attributes.acousticnessMin,
    max_acousticness: attributes.acousticnessMax,
    target_acousticness: attributes.acousticnessTarget,

    min_danceability: attributes.danceabilityMin,
    max_danceability: attributes.danceabilityMax,
    target_danceability: attributes.danceabilityTarget,

    min_duration_ms: attributes.durationMsMin,
    max_duration_ms: attributes.durationMsMax,
    target_duration_ms: attributes.durationMsTarget,

    min_energy: attributes.energyMin,
    max_energy: attributes.energyMax,
    target_energy: attributes.energyTarget,

    min_instrumentalness: attributes.instrumentalnessMin,
    max_instrumentalness: attributes.instrumentalnessMax,
    target_instrumentalness: attributes.instrumentalnessTarget,

    min_liveness: attributes.livenessMin,
    max_liveness: attributes.livenessMax,
    target_liveness: attributes.livenessTarget,

    min_loudness: attributes.loudnessMin,
    max_loudness: attributes.loudnessMax,
    target_loudness: attributes.loudnessTarget,

    min_mode: attributes.modeMin,
    max_mode: attributes.modeMax,
    target_mode: attributes.modeTarget,

    min_speechiness: attributes.speechinessMin,
    max_speechiness: attributes.speechinessMax,
    target_speechiness: attributes.speechinessTarget,

    min_tempo: attributes.tempoMin,
    max_tempo: attributes.tempoMax,
    target_tempo: attributes.tempoTarget,

    min_time_signature: attributes.timeSignatureMin,
    max_time_signature: attributes.timeSignatureMax,
    target_time_signature: attributes.timeSignatureTarget,

    min_valence: attributes.valenceMin,
    max_valence: attributes.valenceMax,
    target_valence: attributes.valenceTarget,

    min_popularity: attributes.popularityMin,
    max_popularity: attributes.popularityMax,
    target_popularity: attributes.popularityTarget,

    min_key: attributes.keyMin,
    max_key: attributes.keyMax,
    target_key: attributes.keyTarget,

    seed_tracks: trackIds,
    seed_artists: artistIds,

    market: "from_token",
  });

  const ids = songs.body.tracks.map((tr) => tr.id);
  const idGroups = chunk(ids, 50);
  const saved = new Set();

  for (const idGroup of idGroups) {
    const savi = await spotifyApi.containsMySavedTracks(idGroup);

    idGroup.forEach((id, index) => {
      if (savi.body[index]) {
        saved.add(id);
      }
    });
  }

  return songs.body.tracks.map((item, index) => ({
    index,
    name: item.name,
    preview_url: item.preview_url,
    id: item.id,
    album: {
      id: item.album.id,
      name: item.album.name,
    },
    artists: item.artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
    })),
    duration: item.duration_ms,
    isLiked: saved.has(item.id),
    uri: item.uri,
    spotifyId: item.id,
  }));
};

export const getTracks: Query<
  "track.tracksById",
  [key: string, trackIds: string[]]
> = async ({ queryKey, signal }) => {
  const token = await getTokenFromCookie();
  if (!token) {
    notFound();
  }

  const spotifyApi = getSpotifyApi(token.accessToken);
  const res = await spotifyApi.getTracks(queryKey[1], {
    market: "from_token",
  });

  return res.body.tracks;
};

interface GenreSearchResult {
  type: "genre";
  id: string;
  label: string;
}

interface ArtistSearchResult {
  type: "artist";
  id: string;
  label: string;
  img: string;
}

interface TrackSearchResult {
  type: "track";
  id: string;
  label: string;
  img: string;
  name: string;
  artists: SpotifyApi.ArtistObjectSimplified[];
}

type SearchResult = GenreSearchResult | ArtistSearchResult | TrackSearchResult;

export const seedSearch = async ({ queryKey, signal }) => {
  const token = await getTokenFromCookie();
  if (!token) {
    notFound();
  }

  const spotifyApi = getSpotifyApi(token.accessToken);

  const allGenres = await spotifyApi.getAvailableGenreSeeds();

  const genres: SearchResult[] = search(queryKey[1], allGenres.body.genres).map(
    (genre) => ({
      type: "genre",
      label: genre,
      id: `${genre}`,
    }),
  );

  const results = await spotifyApi.search(queryKey[1], ["artist", "track"], {
    market: "from_token",
  });

  const artists: ArtistSearchResult[] =
    results.body.artists?.items.map((artist) => ({
      type: "artist",
      label: artist.name,
      id: `${artist.id}`,
      img: artist.images?.[0]?.url,
    })) ?? [];

  const tracks: TrackSearchResult[] =
    results.body.tracks?.items.map((track) => ({
      type: "track",
      label: `${track.artists.map((artist) => artist.name).join(", ")} - ${
        track.name
      }`,
      name: track.name,
      artists: track.artists,
      id: `${track.id}`,
      img: track.album.images?.[0]?.url,
    })) ?? [];

  return [...artists, ...tracks, ...genres];
};

export const getPlaylist: Query<"playlist.byId", [key: string, id: string]> =
  async ({ queryKey, signal }) => {
    const token = await getTokenFromCookie();
    if (!token) {
      return null;
    }

    const spotifyApi = getSpotifyApi(token.accessToken);

    const playlist = await spotifyApi.getPlaylist(queryKey[1], {
      market: "from_token",
    });

    return playlist.body;
  };

export const getPlaylistTracks: Query<
  "playlist.tracks",
  [key: string, id: string]
> = async ({ pageParam = 1, queryKey, signal }) => {
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }

  const spotifyApi = getSpotifyApi(token.accessToken);

  const tracks = await spotifyApi.getPlaylistTracks(queryKey[1], {
    limit: 50,
    offset: pageParam === 1 ? 0 : pageParam * 50,
    market: "from_token",
  });

  return {
    tracks: tracks.body.items.map((item) => ({
      ...item.track,
      added_at: item.added_at,
      isLiked: true,
      spotifyId: item.track?.id,
    })),
    nextPage: tracks.body.next ? pageParam + 1 : null,
    total: tracks.body.total,
  };
};

export const authUrlMutation: Mutation<"auth.url", void> = async () => {
  // const url = await trpc.auth.url.mutate();
  // return url;
};
