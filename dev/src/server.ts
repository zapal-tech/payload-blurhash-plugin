import payload from 'payload';

import express from 'express';
import type { Server } from 'http';
import path from 'path';

import { readFile } from 'fs/promises';

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

app.get('/zapal-test-image.webp', async (_, res) => {
  const zapalTestImage = await readFile(path.resolve(__dirname, 'zapal-test-image.webp'));

  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Content-Type', 'image/webp');
  res.send(zapalTestImage);
});

export const start = async (args: { local: boolean } = { local: false }): Promise<Server> => {
  const { local } = args;

  await payload.init({
    local,
    secret: process.env.PAYLOAD_SECRET || 'here-is-a-secret',
    express: app,
  });

  return app.listen(process.env.PORT || 3000);
};

if (module.id === require.main?.id) start();
