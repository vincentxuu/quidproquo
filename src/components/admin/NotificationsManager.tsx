import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface Routine {
  id: string;
  name: string;
  trigger_type: string;
  enabled: number | boolean;
  notification_enabled: number | boolean;
  notification_channels: string | null;
}

function parseChannelIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x: unknown) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function toBool(v: number | boolean | undefined): boolean {
  return v === true || v === 1;
}

export default function NotificationsManager() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [rowSaved, setRowSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/routines");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { routines?: Routine[] };
        const rows = data.routines ?? [];
        setRoutines(rows);
        const d: Record<string, string> = {};
        for (const r of rows) d[r.id] = parseChannelIds(r.notification_channels).join(", ");
        setDrafts(d);
      } catch {
        setLoadError("載入失敗，請重新整理再試一次。");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function patch(id: string, body: Record<string, unknown>) {
    setSaving((s) => ({ ...s, [id]: true }));
    setRowError((s) => ({ ...s, [id]: "" }));
    setRowSaved((s) => ({ ...s, [id]: false }));
    try {
      const res = await fetch(`/api/admin/routines/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { routine?: Routine };
      if (data.routine) {
        setRoutines((rows) => rows.map((r) => (r.id === id ? { ...r, ...data.routine } : r)));
      }
      setRowSaved((s) => ({ ...s, [id]: true }));
    } catch (err) {
      setRowError((s) => ({ ...s, [id]: err instanceof Error ? err.message : "儲存失敗" }));
    } finally {
      setSaving((s) => ({ ...s, [id]: false }));
    }
  }

  function toggleEnabled(r: Routine, on: boolean) {
    patch(r.id, { notification_enabled: on });
  }

  function saveChannels(r: Routine) {
    const ids = (drafts[r.id] ?? "")
      .split(/[,，\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    patch(r.id, { notification_channels: ids });
  }

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="載入中">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-6">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="mt-3 h-3 w-2/3 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (loadError) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-destructive">{loadError}</p>
          <a href="/admin/routines">
            <Button size="sm" variant="outline" className="mt-3">前往 Routines</Button>
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-amber-500/40">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            傳送端狀態
            <Badge variant="outline">runtime 尚未接線</Badge>
          </CardTitle>
          <CardDescription>
            下方的開關與 channel 設定會確實寫入資料庫（重新整理後仍在），但目前沒有任何 worker 在執行完成時讀取這些值並實際發送通知。傳送端接線方式待確認（webhook secret 要放 env 還是 D1），已登錄升級佇列 Q-028。
          </CardDescription>
        </CardHeader>
      </Card>

      {routines.length === 0 && (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">尚無 routine，沒有東西可以設定通知。</p>
            <a href="/admin/routines/new">
              <Button size="sm" className="mt-3">新增 routine</Button>
            </a>
          </CardContent>
        </Card>
      )}

      {routines.map((r) => {
        const on = toBool(r.notification_enabled);
        const busy = saving[r.id] ?? false;
        return (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2">
                <span className="truncate">{r.name || r.id}</span>
                {on ? <Badge>通知開</Badge> : <Badge variant="secondary">通知關</Badge>}
                {!toBool(r.enabled) && <Badge variant="outline">routine 已停用</Badge>}
              </CardTitle>
              <CardDescription className="font-mono text-xs">{r.id} · {r.trigger_type}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <Switch
                  checked={on}
                  disabled={busy}
                  onCheckedChange={(v) => toggleEnabled(r, v)}
                  aria-label={`${r.name || r.id} 通知開關`}
                />
                <span>完成／失敗時通知</span>
                {busy && <span className="text-xs text-muted-foreground">儲存中…</span>}
                {rowSaved[r.id] && !busy && <span className="text-xs text-muted-foreground">已儲存</span>}
              </label>
              {rowError[r.id] && (
                <p className="text-xs text-destructive" role="alert">{rowError[r.id]}</p>
              )}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={drafts[r.id] ?? ""}
                  disabled={busy}
                  onChange={(e) => setDrafts((d) => ({ ...d, [r.id]: e.target.value }))}
                  placeholder="channel ID，以逗號分隔（例：ops-discord, oncall-ntfy）"
                  aria-label={`${r.name || r.id} channel ID`}
                  className="font-mono"
                />
                <Button size="sm" variant="outline" disabled={busy} onClick={() => saveChannels(r)} className="shrink-0">
                  儲存 channels
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Channel ID 對應 notification_channels 表的 id；支援的類型：discord、ntfy、slack、email、telegram。
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
