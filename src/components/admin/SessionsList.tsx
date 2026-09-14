import { useState, useEffect, useCallback } from "react";
import { cn } from "cn";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminSessionChat } from "@/components/admin/session/AdminSessionChat";

interface Session {
  id: string;
  name?: string;
  instruction?: string;
  summary_detail?: string;
  status: string;
  model?: string;
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

function SessionRow({
  session,
  active,
  onClick,
}: {
  session: Session;
  active: boolean;
  onClick: () => void;
}) {
  const label =
    session.name || (session.instruction || session.id).slice(0, 60);
  const tag =
    session.trigger || (session.routine_id ? "routine" : "manual");

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 border-b border-border px-4 py-3 text-left text-foreground transition-colors last:border-b-0 hover:bg-muted/50",
        active && "bg-muted/70",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium">{label}</span>
        {session.summary_detail && (
          <span className="truncate text-xs text-muted-foreground">
            {session.summary_detail}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
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
    </button>
  );
}

function getHashSessionId(): string {
  if (typeof window === "undefined") return "";
  const h = window.location.hash.replace(/^#/, "");
  return h.startsWith("sess_") ? h : "";
}

export default function SessionsList() {
  const [tab, setTab] = useState("recent");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeId, setActiveId] = useState(getHashSessionId);

  const selectSession = useCallback((id: string) => {
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  const clearSelection = useCallback(() => {
    setActiveId("");
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const h = getHashSessionId();
      setActiveId(h);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

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

  const listPanel = (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="flex h-full flex-col gap-0"
    >
      <TabsList variant="line" className="w-full shrink-0 justify-start">
        <TabsTrigger value="recent">最近</TabsTrigger>
        <TabsTrigger value="pinned">釘選</TabsTrigger>
        <TabsTrigger value="archived">已封存</TabsTrigger>
      </TabsList>

      <TabsContent value={tab} forceMount className="mt-0 flex-1 overflow-y-auto">
        <div className="border-t border-border">
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
            sessions.map((s) => (
              <SessionRow
                key={s.id}
                session={s}
                active={s.id === activeId}
                onClick={() => selectSession(s.id)}
              />
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );

  const chatPanel = activeId ? (
    <AdminSessionChat key={activeId} sessionId={activeId} />
  ) : (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      選擇一個 Session 來查看對話
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border border-border">
      {/* Desktop: side-by-side */}
      <div className="hidden h-full w-[320px] shrink-0 flex-col border-r border-border bg-card lg:flex">
        {listPanel}
      </div>
      <div className="hidden flex-1 bg-background lg:block">
        {chatPanel}
      </div>

      {/* Mobile: toggle between list and chat */}
      <div className="flex h-full w-full flex-col lg:hidden">
        {activeId ? (
          <>
            <div className="flex shrink-0 items-center gap-2 border-b border-border bg-card px-3 py-2">
              <Button type="button" variant="ghost" size="icon" className="size-8" onClick={clearSelection}>
                <ArrowLeft className="size-4" />
              </Button>
              <span className="truncate text-sm font-medium text-foreground">
                {sessions.find(s => s.id === activeId)?.name || activeId.slice(0, 12)}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <AdminSessionChat key={activeId} sessionId={activeId} />
            </div>
          </>
        ) : (
          listPanel
        )}
      </div>
    </div>
  );
}
