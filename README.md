# hiclaw

hiclaw is a cross-platform mobile agent app for iPhone and Android. The first MVP focuses on fast local help through conversation, carpool matching, and second-hand marketplace browsing.

## Product shape

- Default screen: agent conversation history.
- Anonymous users can browse carpool and marketplace listings.
- Login is required only for posting, confirming, contacting, and saving.
- First login methods: phone OTP, Google, Facebook.
- Hidden features unlock through trust level and usage history.

## Tech stack

- Mobile: React Native, Expo, TypeScript.
- API server: NestJS, TypeScript.
- Database: PostgreSQL with PostGIS.
- Cache and jobs: Redis, BullMQ.
- Storage: S3-compatible object storage.

## Local development

Install Node.js 20+, then run:

```bash
npm install
npm run dev:server
npm run dev:mobile
```

Infrastructure for local development:

```bash
docker compose up -d
```

The current repository contains the MVP scaffold. It is designed so the mobile app and API can be developed independently while sharing one release plan.
