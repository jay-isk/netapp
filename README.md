# NetApp Campaign Frontend

Next.js React frontend for the NetApp 12 Days of Giving campaign. This frontend connects to the WordPress plugin REST API.

## Features

- ✅ Integrated with WordPress REST API
- ✅ Session management via cookies
- ✅ Registration and email entry flow
- ✅ Dynamic day unlocking based on campaign dates
- ✅ Real-time answer submission
- ✅ Progress tracking
- ✅ Beautiful UI with Radix UI components

## Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WP_API_URL=http://localhost
NEXT_PUBLIC_WP_SITE_URL=http://localhost
```

Replace `http://localhost` with your WordPress site URL.

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will be available at `http://localhost:9002`

### 4. Build for Production

```bash
npm run build
npm start
```

## Configuration

### WordPress API URL

Set `NEXT_PUBLIC_WP_API_URL` to your WordPress site URL. The frontend will automatically use the REST API endpoints:

- `/wp-json/netapp-campaign/v1/register` - User registration
- `/wp-json/netapp-campaign/v1/session` - Session management
- `/wp-json/netapp-campaign/v1/dashboard` - Get dashboard data
- `/wp-json/netapp-campaign/v1/day/{day_number}` - Get day details
- `/wp-json/netapp-campaign/v1/answer` - Submit answer
- `/wp-json/netapp-campaign/v1/progress` - Get user progress

### CORS Configuration

If your WordPress site is on a different domain, you'll need to configure CORS in WordPress. Add this to your theme's `functions.php` or a plugin:

```php
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
        return $value;
    });
}, 15);
```

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/        # React components
│   ├── advent-calendar.tsx  # Main calendar component
│   ├── email-entry.tsx      # Registration/email entry
│   └── ui/           # UI components (Radix UI)
├── lib/              # Utilities
│   ├── api.ts        # WordPress API client
│   └── utils.ts      # Helper functions
└── hooks/            # React hooks
```

## API Integration

The frontend uses the `campaignAPI` client from `src/lib/api.ts` to communicate with WordPress. All API calls include:

- Cookie-based session management
- Error handling
- TypeScript types
- Loading states

## Development

### Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI components
- **React Hook Form** - Form handling

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check TypeScript

## Troubleshooting

### API Connection Issues

1. Check that `NEXT_PUBLIC_WP_API_URL` is correct
2. Verify WordPress REST API is enabled
3. Check CORS settings if on different domain
4. Check browser console for errors

### Session Issues

1. Ensure cookies are enabled
2. Check that WordPress site URL matches API URL
3. Verify session endpoint is working in WordPress

## License

Same as WordPress plugin license.

