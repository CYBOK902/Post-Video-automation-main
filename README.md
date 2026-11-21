<p align="center">
  <img src="image_8a836c98.jpg" alt="Post Video Automation logo" width="180">
</p>

# TikTok Video Automation

[View the live website](https://postly-tiktok-live.vercel.app)

Post Video Automation helps users connect their TikTok accounts and manage video publishing workflows through TikTok's official APIs.

## Live deployment

The application is deployed on Vercel and uses serverless API routes for TikTok Login Kit OAuth and Content Posting API requests.

Before real publishing works, configure these Vercel environment variables:

- `TIKTOK_CLIENT_KEY`
- `TIKTOK_CLIENT_SECRET`
- `TIKTOK_REDIRECT_URI`
- `SESSION_SECRET`

Register this exact HTTPS callback in the TikTok developer app and set the same value as `TIKTOK_REDIRECT_URI`:

```text
https://postly-tiktok-live.vercel.app/api/tiktok/callback
```

Generate `SESSION_SECRET` with:

```bash
openssl rand -base64 32
```

Run locally with:

```bash
npx vercel dev
```

## Features

- TikTok account authentication through TikTok Login Kit
- Video upload and content management
- Video caption and publishing settings
- Direct video publishing
- Official TikTok Content Posting API integration

## How It Works

Users authenticate using TikTok Login Kit and authorize the permissions required for publishing. After connecting their accounts, users can select or upload video content, prepare captions, configure publishing settings, and initiate video publishing from the website.

The application uses the granted permissions only to facilitate video publishing on behalf of authenticated users. Users remain in control of their content and must authorize each publishing process. All TikTok API access is limited to the functionality described here and is handled according to our [Privacy Policy](privacy.md).

## Documents

- [Privacy Policy](privacy.md)
- [Terms of Service](terms.md)

## Support

For support or account and data deletion requests, contact:

**Email:** [sanjusah905@gmail.com](mailto:sanjusah905@gmail.com)