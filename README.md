# Payload CMS BlurHash Plugin by Zapal

[![](/github-banner.jpg)](https://www.zapal.tech)

Turbocharge your website performance by creating ultralight image placeholders, resulting in a smoother user experience.

### 📋 Requirements

- Payload version `1.7.2` or higher is required (version `2.0.0` or higher is recommended)

## 🚀 Getting started

Instal the package with `yarn add @zapal/payload-blurhash-plugin` or `npm install @zapal/payload-blurhash-plugin`

Now setup the plugin within your `payload.config.ts` file as follows:

```ts
import { buildConfig } from 'payload/config';

import { blurHash } from '@zapal/payload-blurhash-plugin';
import path from 'path';

/* ... */

export default buildConfig({
  plugins: [
    blurHash({
      collections: ['team-photos-collection', 'blog-images-collection'],
    }),
  ],
  /* ... */
});
```

The plugin will generate a readonly `blurhash` field for each image uploaded to the specified collections. Generation
for `imageSizes` are not supported yet (but it's in progress).

### 🎛️ Conditionally enabling/disabling

The proper way to conditionally enable/disable this plugin is to use the `enabled` property.

```ts
blurHash({
  enabled: process.env.ENABLE_BLURHASH_PLUGIN === 'true',
  collections: ['team-photos-collection', 'blog-images-collection'],
}),
```

## ⚙️ Plugin options

This plugin is configurable to work across upload-enabled Payload collections. A `*` denotes that the property is
required.

| Option               | Type     | Description                                                                   |
| -------------------- | -------- | ----------------------------------------------------------------------------- |
| `collections` \* | string[] | Array of upload-enabled collections' slugs you want to enable the plugin for. |
| `enabled`            | boolean  | Conditionally enable/disable plugin. Default: true.                           |
| `width`              | number   | Width to resize the image before computing the blurhash. Default: 32.         |
| `height`             | number   | Height to resize the image before computing the blurhash. Default: 32.        |
| `componentX`         | number   | X component count to pass to the blurhash encoder. Default: 3.                |
| `componentY`         | number   | Y component count to pass to the blurhash encoder. Default: 3.                |

See more information about the `width`, `height`, `componentX`, `componentY` options and BlurHash encoder
[here](https://github.com/woltapp/blurhash#good-questions).

## 💻 Local development

You can find the source code in the `src` directory. For development purposes, you can use the `dev` directory with all
the necessary files to test the plugin in a Payload project. Also we are strongly recommending to use your IDE debugger
instead of `console.log` statements.

You need to follow these steps to start developing and testing the plugin locally:

1. Go to `dev` directory (`cd dev`)
2. Create `.env` file (`cp .env.example .env`)
3. Setup environment variables in `.env` file
4. Install dependencies (`npm i`)
5. Run the project (`npm run dev`)

And you are ready to go!

## 🤝 Contributing

We are open to, and grateful for, any contributions made by the community.

We are planning to add more features to this plugin in the future. If you have any ideas, create an issue to discuss it.

Next steps (v1):

- [ ] Optional blurhash generation for `imageSizes` (in progress)
- [ ] Custom field name support
- [ ] Unit tests
- [ ] Code refactoring

Next steps (v2):

- [ ] Custom options for each collection

## 🛡️ License

This project is licensed under the [MIT License](/LICENSE)

## ⭐ Like what we're doing? Give us a star
