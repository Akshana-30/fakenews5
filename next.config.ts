import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    turbopack: {
        root: __dirname,
    },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "**", pathname: "/**" },
            { protocol: "http", hostname: "**", pathname: "/**" },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "5mb",
        },
    },
};

export default nextConfig;
