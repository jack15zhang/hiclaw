# hiclaw server

NestJS API for the hiclaw MVP.

## Endpoints

- `POST /api/auth/quick-login`
- `GET /api/users/:id`
- `GET /api/carpool`
- `POST /api/carpool`
- `GET /api/marketplace`
- `POST /api/marketplace`
- `POST /api/agent/message`
- `GET /api/trust/:userId/unlocks`

## Next implementation steps

- Replace in-memory demo data with PostgreSQL repositories.
- Add JWT guards for post, confirm, contact, and profile APIs.
- Add Redis caching for anonymous browse endpoints.
- Add queue workers for notifications and long-running agent tasks.
