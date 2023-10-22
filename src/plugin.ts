import type { Config, Plugin } from 'payload/config';

import { getFields } from './fields/getFields';
import { getBeforeChangeHook } from './hooks/beforeChange';
import { defaultOptions } from './options';
import type { PluginOptions } from './types';
import { extendWebpackConfig } from './webpack';

// This plugin extends all targeted collections by generating blurhash for uploaded files

export const blurHash =
  (pluginOptions: PluginOptions): Plugin =>
  (incomingConfig) => {
    const options: PluginOptions = { ...defaultOptions, ...pluginOptions };
    const config: Config = { ...incomingConfig };

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
    } satisfies Config;
  };
