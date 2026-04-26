import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:4000/api/auth/:path*',
      },
      {
        source: '/api/products/:path*',
        destination: 'http://localhost:4000/api/products/:path*',
      },
      {
        source: '/api/categories/:path*',
        destination: 'http://localhost:4000/api/categories/:path*',
      },
      {
        source: '/api/inquiries/:path*',
        destination: 'http://localhost:4000/api/inquiries/:path*',
      },
    ];
  },
};

export default nextConfig;
