/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Use basePath only in CI (GitHub Actions) so local dev works at localhost:3000
  basePath: process.env.GITHUB_ACTIONS ? '/lakemerritt' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
