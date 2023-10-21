import { CollectionConfig } from 'payload/types';

// Collection for images upload and blurhash generation testing
const Images: CollectionConfig = {
  slug: 'images',
  admin: {
    useAsTitle: 'alt',
  },
  upload: {
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'],
    formatOptions: { format: 'webp', options: { smartSubsample: true, quality: 85 } },
    imageSizes: [
      {
        name: '400',
        width: 400,
        height: 500,
      },
      {
        name: '600',
        width: 600,
        height: 750,
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
};

export default Images;
