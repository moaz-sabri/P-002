export const migrations = {
    1(db) {
        const tasks = db.createObjectStore("tasks", { keyPath: "id" });

        const sessions = db.createObjectStore("sessions", { keyPath: "id" });
        sessions.createIndex("startedAt", "startedAt");
        sessions.createIndex("taskId", "taskId");
        sessions.createIndex("status", "status");
        sessions.createIndex("activeSlot", "activeSlot", { unique: true });

        const events = db.createObjectStore("events", { keyPath: "id" });
        events.createIndex("sessionId", "sessionId");

        db.createObjectStore("meta", { keyPath: "key" });
        db.createObjectStore("outbox", { keyPath: "key" });
    }
};