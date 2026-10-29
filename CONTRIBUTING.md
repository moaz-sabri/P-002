# Contributing to Tasker

Tasker is open source. Contributions are welcome if they improve the app without adding unnecessary complexity.

## Local setup

```sh
npm ci
npm run build
npm run dev
```

Requirements:
- Node.js >= 20
- PHP >= 8.0 with PDO SQLite and mbstring

## Before submitting

- Keep changes focused.
- Run `npm run build`.
- Preserve the local-first design and privacy guarantees.
- Prefer simpler implementations over feature-heavy ones.
- Do not add tracking, analytics, or third-party runtime dependencies.

## Code style

- Keep changes small and readable.
- Match existing naming and module boundaries.
- Add comments only where the design needs explanation.

## Pull requests

1. Fork the repository.
2. Create a branch.
3. Make changes.
4. Open a pull request with a clear description.

Security issues should be reported privately according to `SECURITY.md`.