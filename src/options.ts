import type { PluginOptions } from './types';

export const defaultOptions: Partial<PluginOptions> = {
  enabled: true,
  // generateForImageSizes: false,
  width: 32,
  height: 32,
  componentX: 3,
  componentY: 3,
};
