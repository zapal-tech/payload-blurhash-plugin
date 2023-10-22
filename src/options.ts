import type { PluginOptions } from './types';

/**
 * Default options for the plugin.
 */
export const defaultOptions: Partial<PluginOptions> = {
  enabled: true,
  // generateForImageSizes: false,
  width: 32,
  height: 32,
  componentX: 3,
  componentY: 3,
};
