/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    const trpcTarget = process.env.API_PROXY_TARGET_URL;
    console.log("trpcTarget", trpcTarget);

    if (!trpcTarget) {
      return [];
    }

    return [
      {
        source: "/api/external/:path*",
        destination: `${trpcTarget.replace(/\/$/, "")}/:path*`,
      },
    ];
  },
};

export default nextConfig;
