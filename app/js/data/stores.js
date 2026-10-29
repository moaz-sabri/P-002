import { tasksRepo } from "./tasks.repo.js";
import { sessionsRepo } from "./sessions.repo.js";
import { eventsRepo } from "./events.repo.js";
import { NotFoundError, ValidationError } from "../domain/errors.js";
import {
    MAX_TASKS,
    MAX_SESSIONS
} from "../domain/validation.js";

export const RECORDS = Object.freeze([
    {
        type: "task",
        store: "tasks",
        backupKey: "tasks",
        repo: tasksRepo,
        quota: { field: "tasks", max: MAX_TASKS, code: "tasks_limit" }
    },
    {
        type: "session",
        store: "sessions",
        backupKey: "sessions",
        repo: sessionsRepo,
        quota: { field: "sessions", max: MAX_SESSIONS, code: "sessions_limit" }
    },
    { type: "event", store: "events", backupKey: "events", repo: eventsRepo, quota: null }
]);

export const LOCAL_STORES = Object.freeze(["meta", "outbox"]);

const localRepos = new Map();

export function localReader(store) {
    const repo = localRepos.get(store);
    if (!repo) throw new Error(`no local repo for store: ${store}`);
    return r => repo(r[store]);
}

export const VOCABULARY_TYPES = Object.freeze([]);

const byType = new Map(RECORDS.map(r => [r.type, r]));
const byName = new Map(RECORDS.flatMap(r => [[r.type, r], [r.store, r]]));

export const SYNC_TYPES = Object.freeze(RECORDS.map(r => r.type));
export const SYNCED_STORES = Object.freeze(Object.fromEntries(RECORDS.map(r => [r.type, r.store])));
export const BACKUP_STORES = Object.freeze(RECORDS.map(r => r.store));

export function recordFor(name) {
    return byName.get(name);
}

export function repoFor(name) {
    return byName.get(name)?.repo;
}

export function reader(type) {
    const record = byName.get(type);
    if (!record) throw new Error(`unknown record type: ${type}`);
    return r => record.repo(r[record.store]);
}

export async function guardQuota(r, type) {
    const record = byName.get(type);
    if (!record) throw new Error(`unknown record type: ${type}`);
    if (!record.quota) return;
    const { field, max, code } = record.quota;
    if (await record.repo(r[record.store]).count() >= max) {
        throw new ValidationError(field, code);
    }
}