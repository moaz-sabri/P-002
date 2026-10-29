import { h } from "../dom.js";
import { t } from "../../i18n/i18n.js";
import { reportService } from "../../services/report-service.js";
import { formatShort } from "../../domain/time.js";
import { REPORT_PERIODS } from "../../domain/analytics.js";
import {
    page,
    pageHead,
    card,
    sectionTitle,
    statGrid,
    stat
} from "../components/ui.js";
import { selectControl, caption } from "../components/fields.js";

export const reportsPage = {
    title: () => t("reports.title"),

    async mount(root) {
        const body = h("div", { class: "card-grid" });

        let period = "month";

        const { select, element } = selectControl({
            options: REPORT_PERIODS.map(p => ({ value: p, label: t(`reports.period_${p}`) })),
            value: period,
            ariaLabel: t("reports.period")
        });
        select.addEventListener("change", () => {
            period = select.value;
            this.render(body, period);
        });

        root.append(page(
            pageHead({
                title: t("reports.title"),
                icon: "chart",
                actions: h("label", { class: "head-filter" },
                    caption(t("reports.period")),
                    element
                )
            }),
            body
        ));

        await this.render(body, period);
    },

    async render(body, period) {
        const [summary, usage] = await Promise.all([
            reportService.summary(period),
            reportService.usage()
        ]);

        body.replaceChildren(
            card(
                sectionTitle(t("reports.time"), { icon: "clock" }),
                statGrid(
                    stat({ label: t("reports.totalTime"), value: formatShort(summary.totalMs), icon: "clock" }),
                    stat({ label: t("reports.sessionCount"), value: summary.count, icon: "history" }),
                    stat({ label: t("reports.completedTasks"), value: summary.completedTasks, icon: "check" }),
                    stat({ label: t("reports.avgSession"), value: formatShort(reportService.averageSessionMs(summary)), icon: "target" })
                ),
                summary.from
                    ? h("p", { class: "muted small" },
                        t("reports.periodInfo", {
                            from: new Date(summary.from).toLocaleDateString(),
                            to: new Date().toLocaleDateString()
                        }))
                    : null
            ),
            card(
                sectionTitle(t("reports.usage"), { icon: "tasks" }),
                statGrid(
                    stat({ label: t("reports.activeDays"), value: usage.activeDays7, icon: "calendar" }),
                    stat({ label: t("reports.openTasks"), value: summary.openTasks, icon: "tasks" }),
                    stat({ label: t("reports.totalTasks"), value: summary.totalTasks, icon: "check" })
                )
            )
        );
    }
};