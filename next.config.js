/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.notion.so" },
    ],
  },
  rewrites: async () => {
    return [{ source: "/sitemap.xml", destination: "/api/sitemap" }];
  },
};

module.exports = nextConfig;
