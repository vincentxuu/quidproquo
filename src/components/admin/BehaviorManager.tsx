import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface Routine {
  id: string;
  name: string;
  trigger_type: string;
  enabled: number | boolean;
  behavior_auto_fix_pr: number | boolean;
  behavior_auto_create_pr: number | boolean;
}

function toBool(v: number | boolean | undefined): boolean {
  return v === true || v === 1;
}

export default function BehaviorManager() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [rowSaved, setRowSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/routines");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { routines?: Routine[] };
        setRoutines(data.routines ?? []);
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
            生效狀態
            <Badge variant="outline">尚無執行端讀取</Badge>
          </CardTitle>
          <CardDescription>
            下方的開關會確實寫入資料庫（重新整理後仍在），但目前沒有任何 runner 讀取這兩個值並改變行為。執行端要怎麼消費（預設值、權限邊界）待確認，已登錄升級佇列 Q-028。
          </CardDescription>
        </CardHeader>
      </Card>

      {routines.length === 0 && (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">尚無 routine，沒有東西可以設定行為。</p>
            <a href="/admin/routines/new">
              <Button size="sm" className="mt-3">新增 routine</Button>
            </a>
          </CardContent>
        </Card>
      )}

      {routines.map((r) => {
        const busy = saving[r.id] ?? false;
        const fix = toBool(r.behavior_auto_fix_pr);
        const create = toBool(r.behavior_auto_create_pr);
        return (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2">
                <span className="truncate">{r.name || r.id}</span>
                {fix && <Badge>auto-fix 開</Badge>}
                {create && <Badge>auto-create 開</Badge>}
                {!toBool(r.enabled) && <Badge variant="outline">routine 已停用</Badge>}
              </CardTitle>
              <CardDescription className="font-mono text-xs">{r.id} · {r.trigger_type}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <Switch
                  checked={fix}
                  disabled={busy}
                  onCheckedChange={(v) => patch(r.id, { behavior_auto_fix_pr: v })}
                  aria-label={`${r.name || r.id} auto-fix PR 開關`}
                />
                <span>Auto-fix PR（執行結果自動修成 PR）</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <Switch
                  checked={create}
                  disabled={busy}
                  onCheckedChange={(v) => patch(r.id, { behavior_auto_create_pr: v })}
                  aria-label={`${r.name || r.id} auto-create PR 開關`}
                />
                <span>Auto-create PR（執行完成自動開 PR）</span>
              </label>
              {busy && <p className="text-xs text-muted-foreground">儲存中…</p>}
              {rowSaved[r.id] && !busy && <p className="text-xs text-muted-foreground">已儲存</p>}
              {rowError[r.id] && (
                <p className="text-xs text-destructive" role="alert">{rowError[r.id]}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
