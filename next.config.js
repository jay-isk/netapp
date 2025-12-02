/** @type {import('next').NextConfig} */
// Helper function to extract hostname from URL
function getHostnameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return {
      protocol: urlObj.protocol.replace(':', '') || 'https',
      hostname: urlObj.hostname,
    };
  } catch (e) {
    return null;
  }
}

// Build remote patterns for images
const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'purestorage.xarmix.com',
    pathname: '/**',
  },
  {
    protocol: 'http',
    hostname: 'localhost',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'localhost',
    pathname: '/**',
  },
  // Add WordPress staging domain
  {
    protocol: 'https',
    hostname: 'netappstaging.wpenginepowered.com',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'backend.netapp12daysofgiving.com',
    pathname: '/**',
  },
];

// Dynamically add WordPress domain from environment variable
if (process.env.NEXT_PUBLIC_WP_API_URL) {
  const wpHost = getHostnameFromUrl(process.env.NEXT_PUBLIC_WP_API_URL);
  if (wpHost && !remotePatterns.some(p => p.hostname === wpHost.hostname)) {
    remotePatterns.push({
      protocol: wpHost.protocol,
      hostname: wpHost.hostname,
      pathname: '/**',
    });
  }
}

const nextConfig = {
  images: {
    remotePatterns: remotePatterns,
  },
  // Allow API calls to WordPress
  async rewrites() {
    const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost';
    return [
      {
        source: '/api/:path*',
        destination: `${wpApiUrl}/wp-json/netapp-campaign/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

