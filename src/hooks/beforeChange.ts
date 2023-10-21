import type { FileData } from 'payload/dist/uploads/types';
import type { CollectionBeforeChangeHook, CollectionConfig, TypeWithID } from 'payload/types';

import { encode } from 'blurhash';
import sharp from 'sharp';

import { BLURHASH_FIELD_NAME } from '../constants';
import type { File, PluginOptions } from '../types';
import { canComputeBlurhash } from '../utils/canComputeBlurhash';
import { getIncomingFiles } from '../utils/getIncomingFile';

type Args = Required<Omit<PluginOptions, 'collections' | 'enabled'>> & { collection: CollectionConfig };
type Return = CollectionBeforeChangeHook<FileData & TypeWithID>;

export const getBeforeChangeHook =
  ({ collection, /* generateForImageSizes, */ width, height, componentX, componentY }: Args): Return =>
  async ({ req, data }) => {
    const files = getIncomingFiles({ req, data });

    if (!files.length) return data;

    try {
      const uploadedFile = req?.files?.file as
        | (Omit<File, 'mimeType'> & { mimetype: string; data?: Buffer })
        | undefined;

      const canComputeUploadedFile =
        (uploadedFile?.data || uploadedFile?.tempFilePath) && canComputeBlurhash(uploadedFile.mimetype);

      if (canComputeUploadedFile) {
        const pixelsBuffer: Buffer = await sharp(uploadedFile.data ? uploadedFile.data : uploadedFile.tempFilePath)
          .resize(width, height)
          .ensureAlpha(1)
          .raw()
          .toBuffer();

        const pixelsArr: Uint8ClampedArray = new Uint8ClampedArray(pixelsBuffer);

        if (pixelsBuffer.length > 0) {
          const blurhash = encode(pixelsArr, width, height, componentX, componentY);

          // @ts-ignore
          data[BLURHASH_FIELD_NAME] = blurhash; // eslint-disable-line no-param-reassign
        }
      }

      // if (!generateForImageSizes) return data;

      // const uploadedFileSizes = Object.entries(req.payloadUploadSizes || {});

      // if (!uploadedFileSizes.length) return data;

      // uploadedFileSizes.map(async ([sizeName, fileData]: [sizeName: string, fileData: Uint8Array]) => {
      //   const fileInfo = (data?.sizes as any)?.[sizeName] as File;

      //   const canComputeFile = data.sizes && !!fileData && canComputeBlurhash(fileInfo.mimeType);

      //   if (canComputeFile) {
      //     const pixelsBuffer: Buffer = await sharp(fileData).resize(width, height).ensureAlpha(1).raw().toBuffer();

      //     const pixelsArr: Uint8ClampedArray = new Uint8ClampedArray(pixelsBuffer);

      //     if (pixelsBuffer.length > 0) {
      //       const blurhash = encode(pixelsArr, width, height, componentX, componentY);

      //       data = {
      //         ...data,
      //         // @ts-ignore
      //         sizes: { ...data.sizes, [sizeName]: { ...data.sizes![sizeName], [BLURHASH_FIELD_NAME]: blurhash } },
      //       };
      //     }
      //   }
      // });
    } catch (error: unknown) {
      req.payload.logger.warn(
        error,
        `There was an error while computing blurhash corresponding to the collection ${collection.slug} with filename ${data.filename}:`,
      );
    }

    return data;
  };
