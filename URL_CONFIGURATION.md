# URL Configuration Guide

## Current Configuration

### Frontend Application
- **Local Development**: `http://localhost:9002`
- **Port**: 9002 (configured in `package.json`)

### WordPress API Configuration
- **Environment Variable**: `NEXT_PUBLIC_WP_API_URL`
- **Default Value**: `http://localhost` (if not set)
- **Full API Endpoint**: `${NEXT_PUBLIC_WP_API_URL}/wp-json/netapp-campaign/v1`

## URL Locations in Code

### 1. API Base URL (`src/lib/api.ts`)
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost';
const API_ENDPOINT = `${API_BASE_URL}/wp-json/netapp-campaign/v1`;
```

### 2. Next.js Config (`next.config.js`)
- **Image Domains**: Configured in `remotePatterns`
- **API Rewrites**: Uses `NEXT_PUBLIC_WP_API_URL` for rewrites

### 3. Package.json (`package.json`)
- **Dev Server Port**: `9002` (line 6: `"dev": "next dev --turbopack -p 9002"`)

## Setup Instructions

### For Local Development

1. **Create `.env.local` file** in `netapp-frontend/` directory:
```bash
NEXT_PUBLIC_WP_API_URL=http://localhost
```
   - If WordPress is on a different port, include it: `http://localhost:8080`
   - If WordPress is on a different domain: `http://your-wordpress-site.local`

2. **Start the development server**:
```bash
npm run dev
```
   - Frontend will be available at: `http://localhost:9002`

3. **Verify API Connection**:
   - Check browser console for API calls
   - Test endpoint: `http://localhost/wp-json/netapp-campaign/v1/dashboard` (or your WordPress URL)

### For Production (Vercel)

1. **Set Environment Variable in Vercel**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_WP_API_URL` = `https://your-wordpress-site.com`

2. **Redeploy** after setting the variable

## Common Issues

### Issue: API calls failing
- **Check**: Is `NEXT_PUBLIC_WP_API_URL` set correctly?
- **Check**: Does the WordPress URL include the port if needed?
- **Check**: Is WordPress REST API accessible? Test: `${WP_URL}/wp-json/netapp-campaign/v1/dashboard`

### Issue: CORS errors
- The WordPress plugin handles CORS automatically
- Make sure your Vercel domain is allowed (or use `*` for development)

### Issue: Images not loading
- Check `next.config.js` - image domains must be explicitly allowed
- The config automatically adds the WordPress domain from `NEXT_PUBLIC_WP_API_URL`

## Testing URLs

### Local Development
- Frontend: `http://localhost:9002`
- WordPress API: `http://localhost/wp-json/netapp-campaign/v1/*` (or your WordPress URL)

### Production
- Frontend: `https://your-vercel-app.vercel.app`
- WordPress API: `https://your-wordpress-site.com/wp-json/netapp-campaign/v1/*`

## Quick Check Commands

```bash
# Check if .env.local exists
ls -la netapp-frontend/.env.local

# Check environment variable (in Next.js app)
# This will be available at runtime as process.env.NEXT_PUBLIC_WP_API_URL

# Test WordPress API endpoint
curl http://localhost/wp-json/netapp-campaign/v1/dashboard
# Or with your WordPress URL
curl https://your-wordpress-site.com/wp-json/netapp-campaign/v1/dashboard
```

