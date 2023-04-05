import { AttributeName } from './attributes';

export type AttributePreset = {
  id: string;
  label: string;
  attributes: Partial<
    Record<
      AttributeName,
      {
        min: number;
        target: number;
        max: number;
        minEnabled: boolean;
        targetEnabled: boolean;
        maxEnabled: boolean;
      }
    >
  >;
};

export const presets: AttributePreset[] = [
  {
    id: 'acoustic-chill',
    label: 'Acoustic Chill',
    attributes: {
      acousticness: {
        min: 0.5,
        target: 0.8,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      danceability: {
        min: 0,
        target: 0.4,
        max: 0.7,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      energy: {
        min: 0,
        target: 0.3,
        max: 0.6,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      instrumentalness: {
        min: 0,
        target: 0.5,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      valence: {
        min: 0,
        target: 0.4,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      popularity: {
        min: 0,
        target: 50,
        max: 100,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
    },
  },
  {
    id: 'party-time',
    label: 'Party Time',
    attributes: {
      danceability: {
        min: 0.7,
        target: 0.9,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      energy: {
        min: 0.7,
        target: 0.9,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      valence: {
        min: 0.7,
        target: 0.9,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      popularity: {
        min: 0,
        target: 70,
        max: 100,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
    },
  },
  {
    id: 'workout-mix',
    label: 'Workout Mix',
    attributes: {
      energy: {
        min: 0.7,
        target: 0.9,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      tempo: {
        min: 120,
        target: 140,
        max: 200,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      valence: {
        min: 0.5,
        target: 0.8,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      popularity: {
        min: 0,
        target: 60,
        max: 100,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
    },
  },
  {
    id: 'chill-vibes',
    label: 'Relaxing Piano',
    attributes: {
      acousticness: {
        min: 0.5,
        target: 0.9,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      energy: {
        min: 0,
        target: 0.2,
        max: 0.5,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      instrumentalness: {
        min: 0.8,
        target: 1,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      key: {
        min: -1,
        target: 6,
        max: 11,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      mode: {
        min: 0,
        target: 1,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      valence: {
        min: 0,
        target: 0.4,
        max: 0.8,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
    },
  },
  {
    id: 'romantic-ballads',
    label: 'Romantic Ballads',
    attributes: {
      acousticness: {
        min: 0.2,
        target: 0.7,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      danceability: {
        min: 0,
        target: 0.4,
        max: 0.7,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      energy: {
        min: 0,
        target: 0.4,
        max: 0.7,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      valence: {
        min: 0,
        target: 0.5,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      popularity: {
        min: 0,
        target: 50,
        max: 100,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
    },
  },
  {
    id: 'rap-hits',
    label: 'Rap Hits',
    attributes: {
      danceability: {
        min: 0.5,
        target: 0.8,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      energy: {
        min: 0.5,
        target: 0.8,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      speechiness: {
        min: 0.33,
        target: 0.66,
        max: 1,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
      popularity: {
        min: 0,
        target: 70,
        max: 100,
        minEnabled: true,
        targetEnabled: true,
        maxEnabled: true,
      },
    },
  },
];
