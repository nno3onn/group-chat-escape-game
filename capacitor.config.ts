import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.katokbang.escape',
  appName: '카톡방탈출',
  webDir: 'out',
  android: { allowMixedContent: false },
  ios: { contentInset: 'automatic' },
};

export default config;
