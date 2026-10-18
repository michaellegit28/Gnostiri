/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/curriculum", destination: "/highschool/study", permanent: true },
      { source: "/curriculum/:slug", destination: "/highschool/study/:slug", permanent: true },
      { source: "/extras", destination: "/discovery", permanent: true },
      { source: "/extras/:path*", destination: "/discovery/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
