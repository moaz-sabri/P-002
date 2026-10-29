import { withTx } from "../data/db.js";
import { reader } from "../data/stores.js";
import { reportSummary, averageSessionMs as domainAverageSessionMs, activeDays } from "../domain/analytics.js";

const tasks = reader("task");
const sessions = reader("session");

export const reportService = {
    async glance() {
        return withTx(["tasks", "sessions"], "readonly", async r => {
            const ts = await tasks(r).getAll();
            return {
                due: [],
                money: { income: 0, expenses: 0, net: 0, currency: "EUR", debts: { open: 0, net: 0 } },
                today: { totalMs: 0, count: 0 },
                expected: null,
                tasks: ts.filter(t => !t.closed).slice(0, 5).map(t => ({
                    id: t.id,
                    title: t.title,
                    estimatedMs: t.estimatedMs || 0,
                    plannedAt: t.plannedAt,
                    closed: Boolean(t.closed)
                })),
                recent: []
            };
        });
    },
    async summary(period = "month") {
        return withTx(["tasks", "sessions"], "readonly", async r => {
            const ts = await tasks(r).getAll();
            const ss = await sessions(r).getAll();
            return reportSummary({ tasks: ts, sessions: ss, transactions: [], debts: [], debtPayments: [], routines: [], routineLogs: [] }, period);
        });
    },

    async usage() {
        return withTx(["sessions"], "readonly", async r => ({
            activeDays7: activeDays(await sessions(r).getAll(), 7)
        }));
    },

    averageSessionMs(summary) {
        return domainAverageSessionMs(summary);
    }
};