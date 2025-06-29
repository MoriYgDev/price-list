// src/cacheRtl.ts
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';

// NB: A specific plugin configuration is required to integrate rtl with emotion.
// In this case, we use a plugin that is not part of the rtl package.
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});

export default cacheRtl;