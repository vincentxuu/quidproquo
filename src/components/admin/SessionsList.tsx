import { useState, useEffect, useCallback } from "react";
import { cn } from "cn";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Session {
  id: string;
  name?: string;
  instruction?: string;
  summary_detail?: string;
  status: string;
  trigger?: string;
  routine_id?: string;
  created_at?: number | string;
}

function statusColor(status: string): string {
  switch (status) {
    case "done":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "failed":
      return "bg-red-50 text-red-700 border-red-200";
    case "running":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "cancelled":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function relativeTime(ts?: number | string): string {
  if (!ts) return "";
  const d = Date.now() - (typeof ts === "number" ? ts : new Date(ts).getTime());
  const s = Math.floor(d / 1000);
  if (s < 60) return s + "s";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h";
  return Math.floor(h / 24) + "d";
}

function SessionRow({ session }: { session: Session }) {
  const label =
    session.name || (session.instruction || session.id).slice(0, 60);
  const tag =
    session.trigger || (session.routine_id ? "routine" : "manual");

  return (
    <a
      href={`/admin/sessions/${encodeURIComponent(session.id)}`}
      className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-foreground no-underline transition-colors last:border-b-0 hover:bg-muted/50 max-sm:flex-col max-sm:items-start max-sm:gap-1.5"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium">{label}</span>
        {session.summary_detail && (
          <span className="truncate text-xs text-muted-foreground">
            {session.summary_detail}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 max-sm:self-end">
        <span className="rounded bg-muted px-1.5 py-0.5 text-[0.68rem] font-semibold uppercase text-muted-foreground">
          {tag}
        </span>
        <Badge
          variant="outline"
          className={cn("text-[0.68rem]", statusColor(session.status))}
        >
          {session.status}
        </Badge>
        <span className="font-mono text-xs text-muted-foreground">
          {relativeTime(session.created_at)}
        </span>
      </div>
    </a>
  );
}

export default function SessionsList() {
  const [tab, setTab] = useState("recent");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async (t: string) => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ limit: "50" });
    if (t === "pinned") params.set("pinned", "1");
    if (t === "archived") params.set("archived", "1");
    try {
      const res = await fetch("/api/admin/sessions?" + params.toString());
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { sessions?: Session[] };
      setSessions(data.sessions || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(tab);
  }, [tab, load]);

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="flex flex-col gap-0"
    >
      <TabsList variant="line" className="w-full justify-start">
        <TabsTrigger value="recent">最近</TabsTrigger>
        <TabsTrigger value="pinned">釘選</TabsTrigger>
        <TabsTrigger value="archived">已封存</TabsTrigger>
      </TabsList>

      <TabsContent value={tab} forceMount className="mt-0">
        <div className="overflow-hidden rounded-lg border border-border">
          {loading && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              載入中…
            </p>
          )}
          {!loading && error && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              無法載入
            </p>
          )}
          {!loading && !error && sessions.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              沒有符合條件的 Session
            </p>
          )}
          {!loading &&
            !error &&
            sessions.map((s) => <SessionRow key={s.id} session={s} />)}
        </div>
      </TabsContent>
    </Tabs>
  );
}
