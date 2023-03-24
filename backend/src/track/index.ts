import { ee, router } from '..';
import { getSpotifyApi } from '../spotify';
import { procedureWithAuthToken } from '../auth/middleware';
import { z } from 'zod';
import { chunk } from 'lodash';

export const trackRouter = router({
  recentlyPlayed: procedureWithAuthToken
    .input(
      z.object({
        page: z.number(),
      }),
    )
    .query(async (req) => {
      const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);

      const res = await spotifyApi.getMyRecentlyPlayedTracks({
        limit: 50,
        // offset: req.input.page === 1 ? 0 : req.input.page * 50,
      });

      return {
        tracks: res.body.items.map((item) => ({
          ...item.track,
          spotifyId: item.track.id,
          playedAt: item.played_at,
        })),
        nextPage: res.body.next ? req.input.page + 1 : null,
        total: res.body.total,
      };
    }),
  top: procedureWithAuthToken
    .input(
      z.object({
        page: z.number(),
        timeRange: z.enum(['short_term', 'medium_term', 'long_term']),
      }),
    )
    .query(async (req) => {
      const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);

      const res = await spotifyApi.getMyTopTracks({
        limit: 50,
        offset: req.input.page === 1 ? 0 : req.input.page * 50,
        time_range: req.input.timeRange,
      });

      return {
        tracks: res.body.items.map((item) => ({
          ...item,
          spotifyId: item.id,
        })),
        nextPage: res.body.next ? req.input.page + 1 : null,
        total: res.body.total,
      };
    }),
  save: procedureWithAuthToken.input(z.string()).mutation(async (req) => {
    await getSpotifyApi(req.ctx.token.accessToken).addToMySavedTracks([
      req.input,
    ]);

    ee.emit(`save:${req.ctx.token.userId}`, req.input);
  }),
  unsave: procedureWithAuthToken.input(z.string()).mutation(async (req) => {
    await getSpotifyApi(req.ctx.token.accessToken).removeFromMySavedTracks([
      req.input,
    ]);

    ee.emit(`unsave:${req.ctx.token.userId}`, req.input);
  }),
  play: procedureWithAuthToken
    .input(
      z.object({
        trackIds: z.string().array(),
        deviceId: z.string(),
        offset: z.string(),
      }),
    )
    .mutation(async (req) => {
      await getSpotifyApi(req.ctx.token.accessToken).play({
        uris: req.input.trackIds,
        device_id: req.input.deviceId,
        offset: { uri: req.input.offset },
      });
    }),
  tracksById: procedureWithAuthToken
    .input(z.string().array())
    .query(async (req) => {
      const res = await getSpotifyApi(req.ctx.token.accessToken).getTracks(
        req.input,
      );

      return res.body.tracks;
    }),
  recommended: procedureWithAuthToken
    .input(
      z.object({
        attributes: z.object({
          acousticnessMin: z.coerce.number().min(0).max(1).optional(),
          acousticnessTarget: z.coerce.number().min(0).max(1).optional(),
          acousticnessMax: z.coerce.number().min(0).max(1).optional(),

          danceabilityMin: z.coerce.number().min(0).max(1).optional(),
          danceabilityMax: z.coerce.number().min(0).max(1).optional(),
          danceabilityTarget: z.coerce.number().min(0).max(1).optional(),

          durationMsMin: z.coerce.number().min(0).optional(),
          durationMsMax: z.coerce.number().min(0).optional(),
          durationMsTarget: z.coerce.number().min(0).optional(),

          energyMin: z.coerce.number().min(0).max(1).optional(),
          energyMax: z.coerce.number().min(0).max(1).optional(),
          energyTarget: z.coerce.number().min(0).max(1).optional(),

          instrumentalnessMin: z.coerce.number().min(0).max(1).optional(),
          instrumentalnessMax: z.coerce.number().min(0).max(1).optional(),
          instrumentalnessTarget: z.coerce.number().min(0).max(1).optional(),

          livenessMin: z.coerce.number().min(0).max(1).optional(),
          livenessTarget: z.coerce.number().min(0).max(1).optional(),
          livenessMax: z.coerce.number().min(0).max(1).optional(),

          loudnessMin: z.coerce.number().optional(),
          loudnessMax: z.coerce.number().optional(),
          loudnessTarget: z.coerce.number().optional(),

          modeMin: z.coerce.number().min(0).max(1).optional(),
          modeMax: z.coerce.number().min(0).max(1).optional(),
          modeTarget: z.coerce.number().min(0).max(1).optional(),

          speechinessMin: z.coerce.number().min(0).max(1).optional(),
          speechinessMax: z.coerce.number().min(0).max(1).optional(),
          speechinessTarget: z.coerce.number().min(0).max(1).optional(),

          tempoMin: z.coerce.number().min(0).max(500).optional(),
          tempoMax: z.coerce.number().min(0).max(500).optional(),
          tempoTarget: z.coerce.number().min(0).max(500).optional(),

          timeSignatureMin: z.coerce.number().optional(),
          timeSignatureMax: z.coerce.number().optional(),
          timeSignatureTarget: z.coerce.number().optional(),

          valenceMin: z.coerce.number().min(0).max(1).optional(),
          valenceMax: z.coerce.number().min(0).max(1).optional(),
          valenceTarget: z.coerce.number().min(0).max(1).optional(),

          popularityMin: z.coerce.number().min(0).max(100).optional(),
          popularityMax: z.coerce.number().min(0).max(100).optional(),
          popularityTarget: z.coerce.number().min(0).max(100).optional(),

          keyMin: z.coerce.number().min(0).max(11).optional(),
          keyMax: z.coerce.number().min(0).max(11).optional(),
          keyTarget: z.coerce.number().min(0).max(11).optional(),
        }),

        trackIds: z.string().array().optional(),
        artistIds: z.string().array().optional(),
      }),
    )
    .query(async (req) => {
      const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);

      const { attributes } = req.input;

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

        seed_tracks: req.input.trackIds,
        seed_artists: req.input.artistIds,
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
        album: item.album,
        artist: item.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
        duration: item.duration_ms,
        isLiked: saved.has(item.id),
        uri: item.uri,
      }));
    }),
  saved: procedureWithAuthToken
    .input(
      z.object({
        page: z.number(),
      }),
    )
    .query(async (req) => {
      const spotifyApi = getSpotifyApi(req.ctx.token.accessToken);

      const tracks = await spotifyApi.getMySavedTracks({
        limit: 50,
        offset: req.input.page === 1 ? 0 : req.input.page * 50,
      });

      return {
        tracks: tracks.body.items.map((item) => ({
          ...item.track,
          added_at: item.added_at,
          isLiked: true,
          spotifyId: item.track.id,
        })),
        nextPage: tracks.body.next ? req.input.page + 1 : null,
        total: tracks.body.total,
      };
    }),
});
