import type { Config } from 'payload/config';

import path from 'path';
import type { Configuration as WebpackConfig } from 'webpack';

import type { PluginOptions } from './types';

interface Args {
  config: Config;
  options: PluginOptions;
}

export const extendWebpackConfig =
  ({ config }: Args): ((webpackConfig: WebpackConfig) => WebpackConfig) =>
  (webpackConfig) => {
    const existingWebpackConfig =
      typeof config.admin?.webpack === 'function' ? config.admin.webpack(webpackConfig) : webpackConfig;

    const newConfig: WebpackConfig = {
      ...existingWebpackConfig,
      resolve: {
        ...(existingWebpackConfig.resolve || {}),
        alias: {
          ...(existingWebpackConfig.resolve?.alias ? existingWebpackConfig.resolve.alias : {}),
          '@zapal/payload-blurhash-plugin': path.resolve(__dirname, './admin/index.js'),
        },
        fallback: {
          ...(existingWebpackConfig.resolve?.fallback ? existingWebpackConfig.resolve.fallback : {}),
          stream: false,
        },
      },
    };

    return newConfig;
  };
