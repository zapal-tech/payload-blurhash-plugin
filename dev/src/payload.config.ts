import { buildConfig } from 'payload/config';

import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import path from 'path';

import { blurHash } from '../../src/index';

import Images from './collections/Images';
import Users from './collections/Users';

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: (config) => {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        react: path.resolve(__dirname, '../node_modules/react'),
        [path.resolve(__dirname, '../../src/index')]: path.resolve(__dirname, '../../src/admin/index.ts'),
      };

      return config;
    },
  },
  editor: lexicalEditor(),
  db: mongooseAdapter({ url: process.env.MONGODB_URI }),
  collections: [Images, Users],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    disable: true,
  },
  plugins: [
    blurHash({
      collections: [Images.slug],
    }),
  ],
  onInit: async (payload) => {
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    });

    const images = await payload.find({
      collection: 'images',
      limit: 1,
    });

    if (!users.docs.length)
      await payload.create({
        collection: 'users',
        data: {
          email: 'test@zapal.tech',
          password: 'password',
        },
      });

    if (!images.docs.length)
      await payload.create({
        collection: 'images',
        data: {
          alt: 'Zapal Test Banner Image',
        },
        filePath: path.resolve(__dirname, './zapal-test-image.webp'),
      });
  },
});
