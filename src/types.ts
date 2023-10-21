import type { CollectionConfig } from 'payload/types';

export interface File {
  filename: string;
  filesize: number;
  mimeType: string;
  buffer: Buffer;
  tempFilePath?: string;
}

export interface PluginOptions {
  /**
   * Whether or not to enable the plugin
   *
   * Default: true
   */
  enabled?: boolean;

  /*
   * Array of collection slugs that the plugin should apply to.
   * The plugin will apply only utils with `upload` properties.
   */
  collections: Array<CollectionConfig['slug']>;

  /**
   * Generate blurhash for image sizes.
   *
   * Default: false
   *
   * WARNING: This will generate blurhashes for all image sizes, which potentially could be very slow.
   */
  // generateForImageSizes?: boolean;

  /*
   * Width to resize the image before computing the blurhash.
   * Default: 32
   */
  width?: number;

  /*
   * Height to resize the image before computing the blurhash.
   * Default: 32
   */
  height?: number;

  /*
   * X component count to pass to the blurhash encoder.
   * Default: 3
   */
  componentX?: number;

  /*
   * Y component count to pass to the blurhash encoder.
   * Default: 3
   */
  componentY?: number;
}
