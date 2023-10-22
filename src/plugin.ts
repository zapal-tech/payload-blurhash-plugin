import type { Plugin } from 'payload/config';

import { getFields } from './fields/getFields';
import { getBeforeChangeHook } from './hooks/beforeChange';
import { defaultOptions } from './options';
import type { PluginOptions } from './types';
import { extendWebpackConfig } from './webpack';

// This plugin extends all targeted collections by offloading uploaded files
// to cloud storage instead of solely storing files locally.

// It is based on an adapter approach, where adapters can be written for any cloud provider.
// Adapters are responsible for providing four actions that this plugin will use:
// 1. handleUpload, 2. handleDelete, 3. generateURL, 4. staticHandler

// Optionally, the adapter can specify any Webpack config overrides if they are necessary.

export const blurHash =
  (pluginOptions: PluginOptions): Plugin =>
  (incomingConfig) => {
    const options = { ...defaultOptions, ...pluginOptions };
    const config = { ...incomingConfig };

    const { collections: collectionSlugs, enabled } = options;

    const webpack = extendWebpackConfig({ options, config: incomingConfig });

    config.admin = { ...(config.admin || {}), webpack };

    // Return early if disabled. Only webpack config mods are applied.
    if (enabled === false) return config;

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const preparedForHookOptions = {
      // generateForImageSizes: options.generateForImageSizes!,
      width: options.width,
      height: options.height,
      componentX: options.componentX,
      componentY: options.componentY,
    } as Required<
      Pick<PluginOptions, /* 'generateForImageSizes' | */ 'width' | 'height' | 'componentX' | 'componentY'>
    >;

    return {
      ...config,
      collections: (config.collections || []).map((existingCollection) => {
        if (!collectionSlugs.includes(existingCollection.slug)) return existingCollection;

        const fields = getFields(existingCollection);

        return {
          ...existingCollection,
          hooks: {
            ...(existingCollection.hooks || {}),
            beforeChange: [
              ...(existingCollection.hooks?.beforeChange || []),
              getBeforeChangeHook({ collection: existingCollection, ...preparedForHookOptions }),
            ],
          },
          fields,
        };
      }),
    };
  };
