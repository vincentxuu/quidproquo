import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Routine {
  id: string;
  name: string;
  trigger_type: string;
  cron?: string;
  enabled: boolean;
  last_run_status?: string | null;
  last_failure?: { message: string };
}

export default function RoutinesList() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  // The home page links here with ?status=failed.
  const [failedOnly, setFailedOnly] = useState(false);

  useEffect(() => {
    setFailedOnly(new URLSearchParams(window.location.search).get("status") === "failed");
    (async () => {
      try {
        const res = await fetch("/api/admin/routines");
        if (!res.ok) return;
        const data = (await res.json()) as { routines?: Routine[] };
        setRoutines(data.routines ?? []);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const quickTemplates = [
    "Summarize my open PRs every weekday morning",
    "Triage new issues and flag duplicates each morning",
    "Draft release notes whenever a PR merges",
  ];

  const filtered = routines.filter(
    (r) =>
      (!failedOnly || r.last_run_status === "failed") &&
      (!query || r.name.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Routines</h2>
          <p className="text-sm text-muted-foreground">
            Create templated routines that can be kicked off on schedule, by API,
            or webhook.
          </p>
        </div>
        <a href="/admin/routines/new">
          <Button size="sm">+ New routine</Button>
        </a>
      </div>

      {/* Quick templates */}
      <div className="rounded-lg border border-border bg-card p-4">
        <input
          type="text"
          placeholder="What do you want automated?"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {quickTemplates.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setQuery(t)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {failedOnly && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>只顯示最近一次執行失敗的 routine</span>
          <button type="button" className="underline" onClick={() => setFailedOnly(false)}>
            顯示全部
          </button>
        </div>
      )}
      <div className="space-y-2">
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            載入中…
          </p>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {routines.length === 0
              ? "No routines yet. Click New routine."
              : failedOnly
                ? "目前沒有失敗中的 routine。"
                : "No matching routines."}
          </p>
        ) : (
          filtered.map((r) => (
            <a
              key={r.id}
              href={`/admin/routines/${r.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 text-inherit no-underline transition-colors hover:border-primary/40 hover:bg-accent/30"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {r.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {r.trigger_type === "schedule"
                    ? r.cron
                      ? `Cron: ${r.cron}`
                      : "Schedule"
                    : r.trigger_type}
                  {!r.enabled && " · Paused"}
                </div>
                {r.last_run_status === "failed" && (
                  <div className="truncate text-xs text-destructive">
                    最近一次失敗：{r.last_failure?.message ?? "原因未記錄"}
                  </div>
                )}
              </div>
              {r.last_run_status === "failed" ? (
                <Badge variant="destructive">Failing</Badge>
              ) : (
                <Badge variant={r.enabled ? "default" : "secondary"}>
                  {r.enabled ? "Active" : "Paused"}
                </Badge>
              )}
            </a>
          ))
        )}
      </div>
    </div>
  );
}
