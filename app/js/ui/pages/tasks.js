import { h } from "../dom.js";
import { t } from "../../i18n/i18n.js";
import { store } from "../../app/store.js";
import { router } from "../../app/router.js";
import { taskService } from "../../services/task-service.js";
import { sessionService } from "../../services/session-service.js";
import { taskForm } from "../components/task-form.js";
import { taskRow } from "../components/task-row.js";
import { toast } from "../components/toast.js";
import { dialog } from "../components/dialog.js";
import { page, pageHead, list, emptyState, action, backTo as backLink } from "../components/ui.js";
import { searchField } from "../components/fields.js";

export const tasksPage = {
    title: () => t("nav.tasks"),

    async mount(root) {
        const { element: search, input: query } = searchField(t("task.searchPlaceholder"));
        const listBox = h("div", { class: "list" });

        root.append(page(
            pageHead({
                title: t("nav.tasks"),
                icon: "tasks",
                actions: action({ label: t("task.new"), icon: "plus", tone: "primary", href: "/tasks/new" })
            }),
            search,
            listBox
        ));

        const render = () => {
            const q = query.value.trim().toLowerCase();
            const all = store.getState().tasks.filter(x => !x.archived);
            const rows = q
                ? all.filter(x => `${x.title} ${x.note ?? ""}`.toLowerCase().includes(q))
                : all;

            if (rows.length === 0) {
                listBox.replaceChildren(emptyState(t("task.noResults"), {
                    icon: "tasks",
                    action: action({ label: t("task.new"), icon: "plus", tone: "primary", href: "/tasks/new" })
                }));
                return;
            }

            listBox.replaceChildren(list(...rows.map(x => taskRow(x, {
                onStart: async () => {
                    try { await sessionService.start(x.id); await store.refresh("all"); router.navigate("/session"); }
                    catch (e) { toast.show(`error.${e?.code || "unexpected"}`); }
                },
                onTogglePin: async () => {
                    try { await taskService.togglePin(x.id); await store.refresh("all"); }
                    catch (e) { toast.show(`error.${e?.code || "unexpected"}`); }
                },
                onArchive: async () => {
                    try { await taskService[x.archived ? "restore" : "archive"](x.id); await store.refresh("all"); router.navigate("/tasks"); }
                    catch (e) { toast.show(`error.${e?.code || "unexpected"}`); }
                },
                onDelete: async () => {
                    if (await dialog.confirm("task.deleteConfirm")) {
                        try { await taskService.remove(x.id); await store.refresh("all"); router.navigate("/tasks"); }
                        catch (e) { toast.show(`error.${e?.code || "unexpected"}`); }
                    }
                }
            }))));
        };

        query.addEventListener("input", render);
        render();
    }
};

export const newTask = {
    title: () => t("task.new"),
    mount(root) {
        root.append(page(
            pageHead({
                title: t("task.new"),
                icon: "plus",
                leading: backLink("/tasks")
            }),
            taskForm(null, async x => {
                try { await taskService.create(x); await store.refresh("all"); router.navigate("/tasks"); }
                catch (e) { toast.show(`error.${e?.code || "unexpected"}`); }
            })
        ));
    }
};