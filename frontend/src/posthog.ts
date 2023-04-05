import posthog from 'posthog-js';

export const ph = posthog.init(import.meta.env.VITE_POSTHOG_TOKEN, {
  api_host: 'https://eu.posthog.com',
})!;
