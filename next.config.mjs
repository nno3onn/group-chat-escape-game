/** @type {import('next').NextConfig} */
const mobile = process.env.CAPACITOR_BUILD === '1';

const nextConfig = {
  ...(mobile ? {
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
  } : {}),
};

export default nextConfig;
