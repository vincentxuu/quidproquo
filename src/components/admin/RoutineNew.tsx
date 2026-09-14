import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SkillEntry {
  name: string;
  description?: string;
}

export default function RoutineNew() {
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [repo, setRepo] = useState("vincentxuu/quidproquo");
  const [trigger, setTrigger] = useState("schedule");
  const [cron, setCron] = useState("");
  const [connectorNames, setConnectorNames] = useState<string[]>([]);
  const [connectorChecked, setConnectorChecked] = useState<
    Record<string, boolean>
  >({});
  const [skills, setSkills] = useState<SkillEntry[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings/extensions/skills")
      .then((r) => r.json())
      .then((raw: unknown) => {
        const data = raw as { skills?: SkillEntry[] };
        setSkills(data.skills ?? []);
      })
      .catch(() => {});

    fetch("/api/admin/settings/models/registry")
      .then((r) => r.json())
      .then((raw: unknown) => {
        const data = raw as { providers?: { providerId: string }[] };
          const providers = data.providers ?? [];
          const names = providers.length
            ? providers.map((p) => p.providerId)
            : [
                "Exa",
                "Figma",
                "firecrawl",
                "Google Drive",
                "groundlane",
                "linkup",
                "Notion",
                "Tavily",
                "visualize",
              ];
          setConnectorNames(names);
          const checked: Record<string, boolean> = {};
          for (const n of names) checked[n] = true;
          setConnectorChecked(checked);
        }
      )
      .catch(() => {
        const fallback = [
          "Exa",
          "Figma",
          "firecrawl",
          "Google Drive",
          "groundlane",
          "linkup",
          "Notion",
          "Tavily",
          "visualize",
        ];
        setConnectorNames(fallback);
        const checked: Record<string, boolean> = {};
        for (const n of fallback) checked[n] = true;
        setConnectorChecked(checked);
      });
  }, []);

  const handleLoadSkill = () => {
    if (!selectedSkill) return;
    const tmpl = `git pull origin main\n讀 .agents/skills/${selectedSkill}/SKILL.md，依照步驟執行。`;
    setInstructions((prev) => (prev ? prev + "\n\n" + tmpl : tmpl));
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Name required");
      return;
    }
    setSubmitting(true);
    try {
      const connectors = Object.entries(connectorChecked)
        .filter(([, v]) => v)
        .map(([k]) => k);
      const res = await fetch("/api/admin/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          instructions,
          repo,
          trigger_type: trigger,
          cron: cron.trim() || null,
          connectors,
          model: "sonnet-5",
        }),
      });
      const data = (await res.json()) as {
        routine?: { id: string };
        error?: string;
      };
      if (!res.ok) {
        alert(data.error || "failed");
        setSubmitting(false);
        return;
      }
      location.href = `/admin/routines/${data.routine?.id}`;
    } catch {
      alert("Network error");
      setSubmitting(false);
    }
  };

  const triggerOptions = [
    {
      value: "schedule",
      label: "Schedule",
      desc: "Run on a recurring cron schedule or once at a future time",
      disabled: false,
    },
    {
      value: "github",
      label: "GitHub event",
      desc: "Run when a GitHub webhook event fires",
      disabled: true,
    },
    {
      value: "api",
      label: "API",
      desc: "Trigger from your own code by sending a POST request",
      disabled: false,
    },
  ];

  return (
    <div className="mx-auto max-w-[800px] space-y-4">
      <h2 className="text-lg font-bold text-foreground">New routine</h2>

      <div className="space-y-5 rounded-lg border border-border bg-card p-5">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Name *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Daily code review"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        {/* Instructions */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Instructions
          </label>
          <div className="flex gap-2">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
            >
              <option value="">— 直接填寫或選 Skill 自動帶入 —</option>
              {skills.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} — {(s.description ?? "").slice(0, 40)}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLoadSkill}
            >
              帶入
            </Button>
          </div>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={8}
            placeholder="Describe what Claude should do in each session"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        {/* Repository */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Repository
          </label>
          <select
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select a repository</option>
            <option value="vincentxuu/quidproquo">
              vincentxuu/quidproquo
            </option>
          </select>
        </div>

        {/* Trigger */}
        <div className="space-y-2">
          <span className="text-sm font-semibold">Select a trigger</span>
          <div className="space-y-2">
            {triggerOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/40 ${opt.disabled ? "opacity-50" : ""} ${trigger === opt.value ? "border-primary bg-accent/20" : ""}`}
              >
                <input
                  type="radio"
                  name="trigger"
                  value={opt.value}
                  checked={trigger === opt.value}
                  onChange={() => setTrigger(opt.value)}
                  disabled={opt.disabled}
                  className="mt-0.5 accent-primary"
                />
                <div>
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {opt.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {trigger === "schedule" && (
            <input
              value={cron}
              onChange={(e) => setCron(e.target.value)}
              placeholder="0 2 * * *"
              className="mt-2 w-52 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus:border-ring focus:outline-none"
            />
          )}
        </div>

        {/* Connectors */}
        <div className="space-y-2">
          <span className="text-sm font-semibold">Connectors</span>
          <p className="text-xs text-muted-foreground">
            Integrations available to Claude during each run.
          </p>
          <div className="flex flex-wrap gap-2">
            {connectorNames.map((n) => (
              <label
                key={n}
                className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs transition-colors hover:border-primary/40"
              >
                <input
                  type="checkbox"
                  checked={connectorChecked[n] ?? false}
                  onChange={(e) =>
                    setConnectorChecked((prev) => ({
                      ...prev,
                      [n]: e.target.checked,
                    }))
                  }
                  className="accent-primary"
                />
                {n}
              </label>
            ))}
          </div>
          <div className="rounded-md bg-amber-600 px-3 py-2 text-xs text-white">
            Claude can use all tools from these connectors — including
            writes — without asking for permission during runs.
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => history.back()}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={submitting}>
            {submitting ? "Creating…" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
