import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const env = {
  ...process.env,
  CAPACITOR_BUILD: '1',
  NEXT_PUBLIC_APP_TARGET: 'native',
  NEXT_PUBLIC_ADSENSE_CLIENT: '',
  NEXT_PUBLIC_ADSENSE_SLOT_START: '',
  NEXT_PUBLIC_ADSENSE_SLOT_END: '',
};
const next = process.platform === 'win32' ? 'next.cmd' : './node_modules/.bin/next';
const args = process.platform === 'win32' ? ['build'] : ['build'];
const result = spawnSync(next, args, { stdio: 'inherit', env, shell: process.platform === 'win32' });
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
if (result.status !== 0) process.exit(result.status || 1);
if (!existsSync('out/index.html')) {
  console.error('out/index.html이 생성되지 않았어요. 정적 export 설정을 확인해 주세요.');
  process.exit(1);
}
console.log('앱용 정적 빌드 완료: out/');
