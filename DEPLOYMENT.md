# Vercel Deployment Guide

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your WordPress site URL where the NetApp Campaign plugin is installed
3. Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Push to Git Repository

Make sure your code is pushed to a Git repository:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
cd netapp-frontend
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No** (for first deployment)
   - Project name? (Enter a name or press Enter for default)
   - Directory? **./** (current directory)
   - Override settings? **No**

5. Set environment variable:
```bash
vercel env add NEXT_PUBLIC_WP_API_URL
```
   - Enter your WordPress site URL (e.g., `https://yourwordpresssite.com`)
   - Select environments: Production, Preview, Development

6. Redeploy:
```bash
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `netapp-frontend` (if your repo root is the parent directory)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. Add Environment Variable:
   - Go to **Settings** → **Environment Variables**
   - Add new variable:
     - **Name**: `NEXT_PUBLIC_WP_API_URL`
     - **Value**: Your WordPress site URL (e.g., `https://yourwordpresssite.com`)
     - **Environments**: Select Production, Preview, and Development

6. Deploy:
   - Click **"Deploy"**

### 3. CORS Configuration

The NetApp Campaign plugin automatically handles CORS headers for the REST API. By default, it allows requests from any origin. 

**If you need to restrict origins** (recommended for production), you can set allowed origins using WordPress options:

1. Add this to your WordPress `wp-config.php` or use a plugin like "WP Options Editor":
```php
// Set allowed origins (comma-separated)
update_option('netapp_campaign_allowed_origins', 'https://your-vercel-app.vercel.app,https://your-custom-domain.com');
```

Or via WordPress database:
- Option name: `netapp_campaign_allowed_origins`
- Option value: Comma-separated list of allowed origins (e.g., `https://app.vercel.app,https://example.com`)

**Note**: The plugin automatically handles:
- CORS headers for all API requests
- OPTIONS preflight requests
- Credentials (cookies) support
- All necessary headers (Content-Type, Authorization, X-WP-Nonce, etc.)

### 4. Image Domain Configuration

**Why is this required?** Next.js requires explicit allowlisting of external image domains for security reasons. This prevents arbitrary image loading from untrusted sources, protecting against:
- Image-based attacks
- Unauthorized resource consumption
- Privacy concerns (tracking pixels, etc.)

The `next.config.js` is already configured to:
- Automatically extract the hostname from `NEXT_PUBLIC_WP_API_URL`
- Include common domains (localhost, staging, etc.)

**If you need to add additional domains**, update `next.config.js`:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'yourwordpresssite.com',
      pathname: '/**',
    },
  ],
},
```

**Note**: After adding new domains, you must rebuild the application:
```bash
npm run build
```

## Environment Variables

### Required

- `NEXT_PUBLIC_WP_API_URL`: Your WordPress site base URL (e.g., `https://yourwordpresssite.com`)

### Setting in Vercel

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the variable for all environments (Production, Preview, Development)

## Build Verification

After deployment, verify:

1. ✅ Build completes successfully
2. ✅ Environment variable is set correctly
3. ✅ API calls work (check browser console)
4. ✅ Images load correctly
5. ✅ All features work as expected

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript errors are resolved

### API Calls Fail / CORS Errors

- Verify `NEXT_PUBLIC_WP_API_URL` is set correctly
- Check WordPress REST API is accessible (visit `https://yourwordpresssite.com/wp-json/netapp-campaign/v1/dashboard`)
- The plugin automatically handles CORS, but if you see CORS errors:
  - Check browser console for specific error messages
  - Verify the WordPress plugin is activated
  - Try setting `netapp_campaign_allowed_origins` option in WordPress (see CORS Configuration above)
  - Ensure your Vercel domain is in the allowed origins list
- Check that credentials are being sent (check Network tab in browser DevTools)

### Images Not Loading

- Update `next.config.js` with correct image domains
- Verify image URLs are accessible
- Check Next.js Image component configuration

## Custom Domain

To use a custom domain:

1. Go to **Settings** → **Domains** in Vercel
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_WP_API_URL` if needed

## Continuous Deployment

Vercel automatically deploys when you push to your Git repository:
- **Production**: Deploys from `main` branch
- **Preview**: Deploys from other branches and pull requests

## Support

For issues:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)

