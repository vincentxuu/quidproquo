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
      <Card className="border-emerald-500/40">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            傳送端狀態
            <Badge>已接線（無 secret 時不發送）</Badge>
          </CardTitle>
          <CardDescription>
            Routine session 在執行完成時會檢查這裡的設定：只有開關開啟、且該次結果為失敗或需人工處理時才會發送。發送通道由 env secret 決定（`NOTIFICATION_DISCORD_WEBHOOK_URL`／`NOTIFICATION_NTFY_TOPIC`，用 `wrangler secret put` 設定）；沒設定就不發送，不會報錯。下方 channel ID 請填 `global-discord` 或 `global-ntfy`（其餘 ID 需先在 `notification_channels` 表建檔，目前尚無管理 API，見 Q-028）。
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
                Channel ID 目前有效值：`global-discord`、`global-ntfy`（需先設定對應 env secret）。支援的通道類型：discord、ntfy、slack、email、telegram（後三者需寫 code 註冊，見 Q-028）。
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
