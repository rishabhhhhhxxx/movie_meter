// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add the images configuration here
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'image.tmdb.org',
          port: '',
          pathname: '/t/p/**', // This allows all image paths from this specific host
        },
      ],
    },
  };
  
  export default nextConfig;