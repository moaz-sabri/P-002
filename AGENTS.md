# AGENTS.md

This file provides unified work rules for AI agents and future editors of Tasker.

## Project identity

Tasker is a small, local-first personal application for **tasks and timed sessions**.

Core user-facing dimensions:
- Tasks
- Sessions / timer
- Reports (time and task usage)
- Backup and optional sync
- Settings

Do not re-add unrelated domains such as finance, notes, pages, kanban, routines, or Later items unless explicitly requested.

## Stack

- Frontend: plain ES modules, no framework, no runtime dependencies
- Backend: PHP front controller + SQLite
- Storage: IndexedDB locally, optional encrypted sync server
- Build: Webpack to `app/dist/`

## Non-negotiable rules

1. Keep Tasker focused on tasks and sessions.
2. Do not add analytics, telemetry, third-party runtime code, or external font/image dependencies.
3. Preserve local-first behavior: the app must work without a server.
4. Do not weaken privacy: no tracking, no new network calls except app-origin sync.
5. Keep data model in sync across:
   - `app/js/data/stores.js`
   - `app/js/data/migrations.js`
   - `app/js/services/sync-service.js`
   - `api/sync.php`
6. Prefer removing stale code over leaving unused modules.
7. Build must succeed after any change.

## Commands

```sh
npm ci
npm run build
php -d enable_post_data_reading=0 -S 127.0.0.1:8080 -t app docker-router.php
```

## Architecture rules

### Frontend modules
- `app/js/ui/` screens/components
- `app/js/services/` business logic
- `app/js/domain/` pure logic
- `app/js/data/` repositories and IndexedDB access
- `app/js/app/` router, store, event bus, sync

### Data rules
- Record types are registered in `app/js/data/stores.js`.
- IndexedDB stores are created in `app/js/data/migrations.js`.
- Sync must only accept and transmit types defined in both the client registry and `api/sync.php`.
- No record type or store can be introduced in one place without the others.

### Sync rules
- Session records are local during active runs; only completed/cancelled sessions should leave the device.
- The outbox must be able to represent all task/session changes.
- Conflicts resolve by `updatedAt`.
- Tombstones represent deletions.

### UI rules
- Navigation comes from `app/js/ui/components/nav.js`.
- Navigation, routes, and icons must reference only destinations that exist.
- Do not leave navigation entries pointing at deleted screens.
- The home screen should remain a glance and not become a dashboard.

## Change checklist

Before finishing:
- Verify `npm run build` passes.
- Check for references to removed modules, routes, services, and locales.
- Confirm storage and sync mappings still agree.
- Keep changes minimal and coherent.
- Update documentation when behavior changes.

## Style

- Match existing allocation patterns and module names.
- Avoid unnecessary abstractions.
- Use clear names over commentary.
- Prefer small, reviewable changes.