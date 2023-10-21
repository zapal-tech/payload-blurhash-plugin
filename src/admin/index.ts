import type { Config } from 'payload/config';

import type { PluginOptions } from '../types';

import { getFields } from './fields/getFields';

// This is the admin plugin @zapal/payload-blurhash-plugin stubfile.
// It only extends the config that are required by the admin UI.

export const blurHash =
  (pluginOptions: PluginOptions) =>
  (incomingConfig: Config): Config => {
    const { collections: collectionSlugs, enabled } = pluginOptions;
    const config = { ...incomingConfig };

    if (enabled === false) return config;

    return {
      ...config,
      collections: (config.collections || []).map((existingCollection) => {
        if (!collectionSlugs.includes(existingCollection.slug)) return existingCollection;

        const fields = getFields(existingCollection);

        return { ...existingCollection, fields };
      }),
    };
  };
