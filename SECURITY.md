# Security

Tasker is a local-first application. Security and privacy are core to the design.

## Reporting a vulnerability

Please do not open public issues for security vulnerabilities.

If you find a security issue:
1. Email or contact the maintainer privately where possible.
2. Include reproduction steps, impact, and affected files.
3. Do not publish exploit details until a fix is available.

## Security model

- Data is stored locally in IndexedDB by default.
- No analytics, telemetry, or third-party network requests.
- Sync is optional and end-to-end encrypted.
- Server stores ciphertext only; it does not hold the master key.
- Session cookies are HttpOnly and SameSite=Lax (or None in cross-origin setup).
- No password recovery by design.

## Scope

Security reports should focus on:
- authentication or session handling in `api/`
- encryption in `app/js/services/crypto-service.js`
- sync and data integrity in `app/js/services/sync-service.js`
- local database and migrations in `app/js/data`
- on-device attachment handling
- PWA / service worker behavior