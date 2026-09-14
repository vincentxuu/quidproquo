import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ArrowUp, Check, ChevronsUpDown } from "lucide-react";

interface CatalogModel {
  provider: string;
  model: string;
  displayName?: string;
  enabled?: boolean;
}

interface ModelPrefs {
  provider?: string;
  model?: string;
  modelsByProvider?: Record<string, string>;
}

const PREFS_KEY = "qp.admin.composer.modelPrefs";

function readPrefs(): ModelPrefs {
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function savePrefs(prefs: ModelPrefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export default function AdminComposer() {
  const [instruction, setInstruction] = useState("");
  const [mode, setMode] = useState("auto");
  const [effort, setEffort] = useState("high");
  const [fastMode, setFastMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [usageLine, setUsageLine] = useState("");

  const [catalog, setCatalog] = useState<CatalogModel[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [modelOpen, setModelOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedEntry = catalog.find(
    (m) => `${m.provider}:${m.model}` === selectedModel
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings/models");
        if (!res.ok) return;
        const data = (await res.json()) as {
          catalog?: { models?: CatalogModel[] };
        };
        const models: CatalogModel[] = (
          Array.isArray(data.catalog?.models) ? data.catalog.models : []
        ).filter(
          (m: CatalogModel) =>
            m?.provider && m?.model && m?.enabled !== false
        );
        setCatalog(models);

        const prefs = readPrefs();
        const saved =
          prefs.provider && prefs.model
            ? `${prefs.provider}:${prefs.model}`
            : "";
        if (saved && models.some((m) => `${m.provider}:${m.model}` === saved)) {
          setSelectedModel(saved);
        } else if (models.length > 0) {
          setSelectedModel(`${models[0].provider}:${models[0].model}`);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings/cost");
        if (!res.ok) return;
        const data = (await res.json()) as {
          total_tokens?: number;
          total_cost_usd?: number;
        };
        setUsageLine(
          `${(data.total_tokens ?? 0).toLocaleString()} tokens · $${(data.total_cost_usd ?? 0).toFixed(4)}`
        );
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!selectedModel) return;
    const [provider, model] = selectedModel.split(":", 2);
    const prefs = readPrefs();
    prefs.provider = provider;
    prefs.model = model;
    prefs.modelsByProvider = prefs.modelsByProvider || {};
    if (provider && model) prefs.modelsByProvider[provider] = model;
    savePrefs(prefs);
  }, [selectedModel]);

  const autoGrow = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!instruction.trim() || submitting) return;
    setSubmitting(true);

    const [provider, model] = selectedModel.split(":", 2);
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instruction: instruction.trim(),
          mode,
          model: provider && model ? selectedModel : undefined,
          effort,
          fast_mode: fastMode,
          runner_provider: "sandbox",
        }),
      });
      const ct = res.headers.get("content-type") || "";
      const data: { id?: string; error?: string } = ct.includes(
        "application/json"
      )
        ? await res.json()
        : { error: await res.text() };
      if (res.ok && data.id) {
        window.location.href = `/admin/sessions/${encodeURIComponent(data.id)}`;
      } else {
        alert(data.error || `建立失敗（HTTP ${res.status}）`);
        setSubmitting(false);
      }
    } catch {
      alert("網路錯誤");
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const providers = [...new Set(catalog.map((m) => m.provider))].sort();

  return (
    <div className="flex w-full max-w-[720px] flex-col gap-3 px-4 pb-4 mx-auto">
      {/* Input area */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2 rounded-xl border border-border bg-card p-2 pl-4 shadow-sm transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
          <textarea
            ref={textareaRef}
            value={instruction}
            onChange={(e) => {
              setInstruction(e.target.value);
              autoGrow();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Describe a task or ask a question"
            rows={1}
            className="flex-1 resize-none border-0 bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
            style={{ minHeight: "24px", maxHeight: "200px" }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={submitting || !instruction.trim()}
            className="size-8 shrink-0 rounded-lg"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </form>

      {/* Bottom toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Left side: mode + fast */}
        <div className="flex items-center gap-1.5">
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="h-7 w-auto gap-1 border-0 bg-transparent px-2 text-xs font-medium text-muted-foreground shadow-none hover:bg-accent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="default">Accept edits</SelectItem>
              <SelectItem value="plan">Plan</SelectItem>
            </SelectContent>
          </Select>

          <label className="flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-accent">
            <input
              type="checkbox"
              checked={fastMode}
              onChange={(e) => setFastMode(e.target.checked)}
              className="size-3 accent-primary"
            />
            Fast
          </label>
        </div>

        <div className="flex-1" />

        {/* Right side: model picker + effort */}
        <div className="flex items-center gap-1.5">
          {/* Model combobox */}
          <Popover open={modelOpen} onOpenChange={setModelOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                role="combobox"
                aria-expanded={modelOpen}
                className="h-7 gap-1 px-2 text-xs font-medium text-muted-foreground"
              >
                {selectedEntry
                  ? `${selectedEntry.provider} / ${selectedEntry.displayName || selectedEntry.model}`
                  : "Select model"}
                <ChevronsUpDown className="size-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="end">
              <Command>
                <CommandInput placeholder="Search models..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No model found.</CommandEmpty>
                  {providers.map((provider) => (
                    <CommandGroup key={provider} heading={provider}>
                      {catalog
                        .filter((m) => m.provider === provider)
                        .map((m) => {
                          const val = `${m.provider}:${m.model}`;
                          return (
                            <CommandItem
                              key={val}
                              value={`${m.provider} ${m.displayName || m.model}`}
                              onSelect={() => {
                                setSelectedModel(val);
                                setModelOpen(false);
                              }}
                            >
                              <span className="truncate">
                                {m.displayName || m.model}
                              </span>
                              <Check
                                className={cn(
                                  "ml-auto size-3",
                                  selectedModel === val
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          );
                        })}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Effort */}
          <Select value={effort} onValueChange={setEffort}>
            <SelectTrigger className="h-7 w-auto gap-1 border-0 bg-transparent px-2 text-xs font-medium text-muted-foreground shadow-none hover:bg-accent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Usage */}
      {usageLine && (
        <p className="text-center text-[0.7rem] text-muted-foreground">
          {usageLine}
        </p>
      )}
    </div>
  );
}
