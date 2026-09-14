import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RoutineData {
  name: string;
  enabled: boolean;
  trigger_type: string;
  cron?: string;
  repo?: string;
  model?: string;
  connectors?: string;
  instructions?: string;
}

interface RunData {
  id: string;
  status: string;
  created_at: string | number;
}

export default function RoutineDetail({ routineId }: { routineId: string }) {
  const [routine, setRoutine] = useState<RoutineData | null>(null);
  const [runs, setRuns] = useState<RunData[]>([]);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [runFilter, setRunFilter] = useState("");
  const [runSearch, setRunSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/routines/${routineId}`);
        const data = (await res.json()) as {
          routine?: RoutineData;
          runs?: RunData[];
          error?: string;
        };
        if (!res.ok) {
          setError(data.error || "not found");
          return;
        }
        setRoutine(data.routine ?? null);
        setRuns(data.runs ?? []);
      } catch {
        setError("Failed to load");
      }
    })();
  }, [routineId]);

  const filteredRuns = runs.filter((r) => {
    if (runFilter && r.status !== runFilter) return false;
    if (runSearch && !r.id.toLowerCase().includes(runSearch.toLowerCase()))
      return false;
    return true;
  });

  const loadTranscript = useCallback(
    async (sid: string) => {
      try {
        const r = await fetch(`/api/admin/sessions/${sid}`);
        const d = (await r.json()) as {
          messages?: { role: string; content_json: string; tool_name?: string }[];
          error?: string;
        };
        if (!r.ok) {
          setTranscript(d.error || "not found");
          return;
        }
        const msgs = d.messages ?? [];
        setTranscript(
          msgs
            .map(
              (m) =>
                `[${m.role}] ${JSON.parse(m.content_json)}${m.tool_name ? " (" + m.tool_name + ")" : ""}`
            )
            .join("\n\n") || "(no messages)"
        );
      } catch {
        setTranscript("Failed to load");
      }
    },
    []
  );

  const handleRunNow = async () => {
    try {
      const res = await fetch(`/api/admin/routines/${routineId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run" }),
      });
      const data = (await res.json()) as {
        sessionId?: string;
        error?: string;
      };
      if (!res.ok) {
        alert(data.error || "failed");
      } else {
        setTranscript(`Started session ${data.sessionId}`);
      }
    } catch {
      alert("Network error");
    }
  };

  if (error) {
    return (
      <p className="py-8 text-center text-sm text-destructive">{error}</p>
    );
  }

  if (!routine) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        載入中…
      </p>
    );
  }

  const connectors = (() => {
    try {
      return JSON.parse(routine.connectors || "[]") as string[];
    } catch {
      return [];
    }
  })();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-foreground">{routine.name}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button size="sm" onClick={handleRunNow}>
            Run now
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: Config + Runs */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold">Configuration</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex gap-2">
                <span className="text-muted-foreground">Enabled:</span>
                <Badge variant={routine.enabled ? "default" : "secondary"}>
                  {routine.enabled ? "On" : "Off"}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Trigger: </span>
                {routine.trigger_type}
                {routine.cron ? ` · ${routine.cron}` : ""}
              </div>
              <div>
                <span className="text-muted-foreground">Repo: </span>
                {routine.repo ?? "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Model: </span>
                {routine.model ?? "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Connectors: </span>
                {connectors.join(", ") || "—"}
              </div>
            </div>

            <h3 className="mb-2 mt-4 text-sm font-semibold">Instructions</h3>
            <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
              {routine.instructions || "(none)"}
            </pre>

            <h3 className="mb-2 mt-4 text-sm font-semibold">Runs</h3>
            <div className="mb-2 flex gap-2">
              <input
                placeholder="Filter"
                value={runFilter}
                onChange={(e) => setRunFilter(e.target.value)}
                className="w-20 rounded-md border border-input bg-background px-2 py-1 text-xs placeholder:text-muted-foreground focus:border-ring focus:outline-none"
              />
              <input
                placeholder="Search runs"
                value={runSearch}
                onChange={(e) => setRunSearch(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs placeholder:text-muted-foreground focus:border-ring focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              {filteredRuns.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No fires yet
                </p>
              ) : (
                filteredRuns.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => loadTranscript(r.id)}
                    className="flex w-full items-center justify-between rounded-md border border-border bg-background p-2 text-left text-xs transition-colors hover:border-primary/40"
                  >
                    <span>
                      {r.id.slice(0, 8)} ·{" "}
                      <Badge
                        variant={
                          r.status === "done"
                            ? "default"
                            : r.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-[0.65rem]"
                      >
                        {r.status}
                      </Badge>{" "}
                      · {new Date(r.created_at).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">›</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Session transcript */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-2 text-sm font-semibold">Session</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Continues in the same session across runs.
          </p>
          <pre className="max-h-[50vh] min-h-[300px] overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
            {transcript || "Click a run to view transcript"}
          </pre>
        </div>
      </div>
    </div>
  );
}
