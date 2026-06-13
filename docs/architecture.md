# hiclaw architecture

## Goals

- Support a fast, conversation-first helper app.
- Let anonymous users browse carpool and marketplace data.
- Require identity only when user actions create trust or safety risk.
- Preserve location privacy by matching on approximate geography.
- Scale toward 100,000 concurrent users through stateless services and cache-heavy reads.

## High-level system

```text
Mobile App
  |
CDN / WAF
  |
Load Balancer
  |
API Gateway
  |
NestJS API services
  |-- Auth
  |-- Users
  |-- Carpool
  |-- Marketplace
  |-- Agent
  |-- Trust
  |
PostgreSQL + PostGIS
Redis Cluster
Object Storage
Queue Workers
Push Notification Workers
```

## Privacy model

- Store approximate user location with geohash and PostGIS geography.
- Listing cards expose area labels and distance bands, not precise coordinates.
- Precise pickup or meeting points are exchanged only after both parties confirm.
- Expire precise task locations when a carpool or transaction finishes.

## Scaling model

- Keep API instances stateless and horizontally scalable.
- Cache browse feeds and listing details in Redis.
- Use read replicas for heavy browse traffic.
- Use PostGIS indexes for nearby matching.
- Send media through object storage plus CDN.
- Move long-running agent tasks and notifications into queues.

## MVP boundaries

Included:

- Anonymous browse.
- Login trigger for post, confirm, contact.
- Carpool offer/request feed and post flow.
- Marketplace feed and post flow.
- Basic agent intent routing.
- Trust level and feature unlock framework.

Deferred:

- Payment.
- Full real-time IM.
- Full dating experience.
- Advanced recommendation engine.
- Dispute and refund workflow.
