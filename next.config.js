/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    mdxRs: true, // @next/mdx
    serverComponentsExternalPackages: ["mongoose"],
  },
};

module.exports = nextConfig;
