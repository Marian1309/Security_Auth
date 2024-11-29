import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    remotePatterns: []
  },
  compress: true,
  poweredByHeader: false,
  optimizeFonts: true
};

export default withBundleAnalyzer(nextConfig);
