/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Handling canvas and encoding
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // Handle worker imports
    config.module.rules.push({
      test: /pdf\.worker\.m?js$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[hash][ext][query]'
      }
    });

    return config;
  },
};

export default nextConfig;
