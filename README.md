# Tasker

Tasker is a simple, local-first personal application for tasks and timed sessions.

It helps you keep what you mean to do, measure how you spend your time, and review where that time went — without accounts, tracking, or unnecessary complexity.

## Features

- Tasks with estimates, planned dates, subtasks, pinning, and archiving
- Start task sessions or free sessions
- Running session stays visible while you navigate
- Reports for total time, session count, completed tasks, average session, and active days
- Export/import backup
- Optional encrypted sync
- PWA installable offline app

## Run locally

```sh
npm ci
npm run build
npm run dev
```

Then open http://127.0.0.1:8080.

Requirements:
- Node.js >= 20
- PHP >= 8.0 with pdo_sqlite and mbstring

## Privacy

Your records live in this browser's IndexedDB by default. No analytics or tracking. Sync is optional, off by default, and end-to-end encrypted.

## License

Tasker is licensed under AGPL-3.0-or-later. See [LICENSE](LICENSE).