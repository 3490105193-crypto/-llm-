"use client";

import { clsx } from "clsx";
import {
  Activity,
  AlertTriangle,
  Bell,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarClock,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  LineChart,
  RefreshCw,
  Search,
  ShieldAlert,
  SlidersHorizontal
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import {
  buildScenarioImpacts,
  calculateMarketHealth,
  calculatePortfolioRisk,
  choosePrimaryScenario,
  formatPct,
  formatWeight,
  getAssetResearchContext,
  rankAssets,
  severityTone,
  summarizeLlmBrief,
  summarizeResearchQueue
} from "../analysis";
import {
  getLiveMarketBriefStatus,
  startLiveMarketBrief,
  type LiveBriefStatus
} from "../data/live-llm-client";
import type { LlmMarketBrief, MarketAsset, MarketSnapshot, SavedView } from "../schemas";
import { AlertCenter } from "./AlertCenter";
import { AiBriefing } from "./AiBriefing";
import { AssetDetail } from "./AssetDetail";
import { AssetTable } from "./AssetTable";
import { MarketPulseChart } from "./MarketPulseChart";
import { MetricCard } from "./MetricCard";
import { RiskLab } from "./RiskLab";
import { ScenarioPanel } from "./ScenarioPanel";
import { SectorHeatmap } from "./SectorHeatmap";

type MarketDashboardProps = {
  snapshot: MarketSnapshot | null;
};

type WorkspaceId = "overview" | "ai-brief" | "screener" | "portfolio" | "scenarios" | "alerts";
type LiveBriefUiState = {
  mode: "sample" | "submitting" | "running" | "live" | "failed";
  taskId?: string;
  progress?: number;
  error?: string;
  updatedAt?: string;
};

const workspaceItems = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "ai-brief", label: "AI Brief", Icon: BrainCircuit },
  { id: "screener", label: "Screener", Icon: Search },
  { id: "portfolio", label: "Portfolio", Icon: BriefcaseBusiness },
  { id: "scenarios", label: "Scenarios", Icon: Gauge },
  { id: "alerts", label: "Alerts", Icon: Bell }
] satisfies Array<{ id: WorkspaceId; label: string; Icon: typeof Activity }>;

export function MarketDashboard({ snapshot }: MarketDashboardProps) {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>("overview");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MarketAsset["category"] | "All">("All");
  const [region, setRegion] = useState<MarketAsset["region"] | "All">("All");
  const [sector, setSector] = useState("All");
  const [minimumScore, setMinimumScore] = useState(35);
  const [maximumRisk, setMaximumRisk] = useState(85);
  const [minimumQuality, setMinimumQuality] = useState(30);
  const [selectedSymbol, setSelectedSymbol] = useState(snapshot?.assets[0]?.symbol ?? "");
  const [activeScenarioId, setActiveScenarioId] = useState(
    snapshot ? choosePrimaryScenario(snapshot.scenarios).id : ""
  );
  const [liveBrief, setLiveBrief] = useState<LlmMarketBrief | null>(null);
  const [liveBriefState, setLiveBriefState] = useState<LiveBriefUiState>({ mode: "sample" });
  const [isRefreshing, startRefresh] = useTransition();

  const categories = useMemo<Array<MarketAsset["category"] | "All">>(() => {
    if (!snapshot) {
      return ["All"];
    }

    return ["All", ...Array.from(new Set(snapshot.assets.map((asset) => asset.category)))];
  }, [snapshot]);

  const regions = useMemo<Array<MarketAsset["region"] | "All">>(() => {
    if (!snapshot) {
      return ["All"];
    }

    return ["All", ...Array.from(new Set(snapshot.assets.map((asset) => asset.region)))];
  }, [snapshot]);

  const sectors = useMemo(() => {
    if (!snapshot) {
      return ["All"];
    }

    return ["All", ...Array.from(new Set(snapshot.assets.map((asset) => asset.sector)))];
  }, [snapshot]);

  const rankedAssets = useMemo(() => {
    if (!snapshot) {
      return [];
    }

    return rankAssets(snapshot, {
      query,
      category,
      region,
      sector,
      minimumScore,
      maximumRisk,
      minimumQuality
    });
  }, [category, maximumRisk, minimumQuality, minimumScore, query, region, sector, snapshot]);

  const selectedAsset =
    rankedAssets.find((asset) => asset.symbol === selectedSymbol) ?? rankedAssets[0];
  const marketHealth = snapshot ? calculateMarketHealth(snapshot) : 0;
  const portfolioSummary = useMemo(
    () => (snapshot ? calculatePortfolioRisk(snapshot) : null),
    [snapshot]
  );
  const scenarioImpacts = useMemo(
    () => (snapshot ? buildScenarioImpacts(snapshot) : []),
    [snapshot]
  );
  const activeScenarioImpact =
    scenarioImpacts.find((impact) => impact.scenario.id === activeScenarioId) ?? scenarioImpacts[0];
  const researchSummary = snapshot ? summarizeResearchQueue(snapshot.researchQueue) : null;
  const activeLlmBrief = liveBrief ?? snapshot?.llmBrief;
  const llmSummary = activeLlmBrief ? summarizeLlmBrief(activeLlmBrief) : null;
  const assetContext =
    snapshot && selectedAsset
      ? getAssetResearchContext(snapshot, selectedAsset.symbol)
      : { tasks: [], alerts: [], events: [] };

  function applySavedView(view: SavedView) {
    setCategory(view.category);
    setMinimumScore(view.minimumScore);
    setMaximumRisk(view.maximumRisk);
    setMinimumQuality(view.minimumQuality);
    setRegion("All");
    setSector("All");
    setQuery("");
  }

  async function runLiveLlmBrief() {
    setActiveWorkspace("ai-brief");
    setLiveBriefState({ mode: "submitting", progress: 0 });

    try {
      const accepted = await startLiveMarketBrief();
      setLiveBriefState({
        mode: "running",
        taskId: accepted.taskId,
        progress: 0
      });

      for (let attempt = 0; attempt < 90; attempt += 1) {
        await delay(3000);
        const status = await getLiveMarketBriefStatus(accepted.taskId);

        if (status.status === "completed") {
          setLiveBrief(status.brief);
          setLiveBriefState({
            mode: "live",
            taskId: status.taskId,
            progress: 100,
            updatedAt: new Date().toISOString()
          });
          return;
        }

        if (isTerminalLiveStatus(status)) {
          throw new Error(status.error);
        }

        setLiveBriefState({
          mode: "running",
          taskId: status.taskId,
          progress: status.progress
        });
      }

      throw new Error("daily_stock_analysis task did not complete within 270 seconds");
    } catch (error) {
      setLiveBriefState({
        mode: "failed",
        error: error instanceof Error ? error.message : "Live LLM market review failed"
      });
    }
  }

  if (!snapshot) {
    return (
      <main className="grid min-h-screen place-items-center bg-paper px-4 text-ink">
        <section
          className="w-full max-w-xl rounded-lg border border-coral/30 bg-white p-6 shadow-dashboard"
          role="alert"
        >
          <p className="text-sm font-semibold text-coral">Data status</p>
          <h1 className="mt-2 text-2xl font-semibold">Market data unavailable</h1>
          <p className="mt-3 text-sm text-slate-600">Validated market snapshot failed to load.</p>
        </section>
      </main>
    );
  }

  const displayedLlmBrief = activeLlmBrief ?? snapshot.llmBrief;

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto grid w-full max-w-[1500px] gap-4 px-4 py-4 lg:grid-cols-[230px_1fr] lg:px-6">
        <aside
          className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]"
          aria-label="Workspace navigation"
        >
          <div className="rounded-lg border border-line bg-white p-3 shadow-dashboard">
            <div className="border-b border-line px-2 pb-3">
              <p className="text-xs font-semibold uppercase text-slate-500">Market Lens Pro</p>
              <h1 className="mt-1 text-xl font-semibold">Research workbench</h1>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Snapshot{" "}
                {new Date(snapshot.asOf).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit"
                })}
              </p>
            </div>

            <nav
              className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-col"
              aria-label="Market workspaces"
            >
              {workspaceItems.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  className={clsx(
                    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold",
                    activeWorkspace === id
                      ? "bg-ink text-white"
                      : "border border-line bg-paper text-ink hover:bg-white"
                  )}
                  type="button"
                  aria-pressed={activeWorkspace === id}
                  onClick={() => setActiveWorkspace(id)}
                >
                  <Icon aria-hidden="true" size={18} />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <header className="rounded-lg border border-line bg-white p-4 shadow-dashboard">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {snapshot.regime.name}
                </p>
                <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
                  Institutional market cockpit
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {snapshot.regime.summary}
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 xl:min-w-[460px]">
                <HeaderPill label="Universe" value={`${snapshot.assets.length} assets`} />
                <HeaderPill label="Benchmark" value={snapshot.portfolio.benchmark} />
                <button
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                  type="button"
                  disabled={isRefreshing}
                  onClick={() => startRefresh(() => setQuery((current) => current))}
                >
                  <RefreshCw
                    aria-hidden="true"
                    className={isRefreshing ? "animate-spin" : ""}
                    size={18}
                  />
                  {isRefreshing ? "Refreshing" : "Refresh"}
                </button>
              </div>
            </div>
          </header>

          {activeWorkspace === "overview" ? (
            <>
              <section
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
                aria-label="Market metrics"
              >
                <MetricCard
                  label="Health"
                  value={`${marketHealth}/100`}
                  detail="Composite of regime, breadth, momentum, risk, and confidence."
                  tone="positive"
                  icon={<Activity aria-hidden="true" size={20} />}
                />
                <MetricCard
                  label="Portfolio risk"
                  value={portfolioSummary ? `${portfolioSummary.weightedRisk}/100` : "N/A"}
                  detail={
                    portfolioSummary
                      ? `Beta ${portfolioSummary.weightedBeta}; hedge ${formatWeight(
                          portfolioSummary.hedgeWeight
                        )}.`
                      : "No portfolio data."
                  }
                  tone="warning"
                  icon={<ShieldAlert aria-hidden="true" size={20} />}
                />
                <MetricCard
                  label="Scenario P/L"
                  value={activeScenarioImpact ? formatPct(activeScenarioImpact.totalImpact) : "N/A"}
                  detail={activeScenarioImpact?.scenario.name ?? "No active scenario."}
                  tone={
                    activeScenarioImpact && activeScenarioImpact.totalImpact < 0
                      ? "danger"
                      : "positive"
                  }
                  icon={<LineChart aria-hidden="true" size={20} />}
                />
                <MetricCard
                  label="Research open"
                  value={`${researchSummary?.open ?? 0}`}
                  detail={`${researchSummary?.highPriorityOpen ?? 0} high priority tasks need review.`}
                  tone={(researchSummary?.highPriorityOpen ?? 0) > 0 ? "danger" : "neutral"}
                  icon={<ClipboardList aria-hidden="true" size={20} />}
                />
              </section>

              <section className="rounded-lg border border-line bg-white p-4 shadow-dashboard">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500">LLM read</p>
                    <h2 className="mt-1 text-xl font-semibold">AI market stance</h2>
                    <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
                      {displayedLlmBrief.marketView.summary}
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[420px]">
                    <HeaderPill label="Stance" value={displayedLlmBrief.marketView.stance} />
                    <HeaderPill
                      label="Confidence"
                      value={`${displayedLlmBrief.marketView.confidence}%`}
                    />
                    <HeaderPill
                      label="Top action"
                      value={llmSummary?.highestConviction?.symbol ?? "N/A"}
                    />
                  </div>
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
                <MarketPulseChart snapshot={snapshot} />

                <section
                  id="signals"
                  aria-labelledby="signals-title"
                  className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">Signals</p>
                      <h2 id="signals-title" className="mt-1 text-xl font-semibold">
                        Macro stack
                      </h2>
                    </div>
                    <div className="grid h-10 w-10 place-items-center rounded-md border border-amber/30 bg-amber/10 text-amber">
                      <AlertTriangle aria-hidden="true" size={20} />
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {snapshot.macroSignals.map((signal) => (
                      <article
                        key={signal.label}
                        className="rounded-md border border-line bg-paper p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-semibold">{signal.label}</h3>
                          <span className="rounded-full border border-line bg-white px-2 py-1 text-xs font-semibold">
                            {signal.value}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-5 text-slate-600">{signal.summary}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </section>

              <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <SectorHeatmap snapshot={snapshot} />
                <OverviewQueue snapshot={snapshot} />
              </section>
            </>
          ) : null}

          {activeWorkspace === "ai-brief" ? (
            <AiBriefing
              brief={displayedLlmBrief}
              liveState={liveBriefState}
              onRunLive={runLiveLlmBrief}
            />
          ) : null}

          {activeWorkspace === "screener" ? (
            <>
              <section
                className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
                aria-labelledby="filter-title"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-md border border-line bg-paper text-ink">
                      <SlidersHorizontal aria-hidden="true" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        Universe controls
                      </p>
                      <h2 id="filter-title" className="text-lg font-semibold">
                        {rankedAssets.length} matching assets
                      </h2>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[780px] xl:grid-cols-4">
                    <SelectControl
                      label="Category"
                      value={category}
                      onChange={setCategory}
                      options={categories}
                    />
                    <SelectControl
                      label="Region"
                      value={region}
                      onChange={setRegion}
                      options={regions}
                    />
                    <SelectControl
                      label="Sector"
                      value={sector}
                      onChange={setSector}
                      options={sectors}
                    />
                    <label className="block text-sm">
                      <span className="text-xs font-semibold uppercase text-slate-500">
                        Min score
                      </span>
                      <input
                        className="mt-2 w-full accent-ocean"
                        type="range"
                        min="0"
                        max="100"
                        value={minimumScore}
                        onChange={(event) => setMinimumScore(Number(event.target.value))}
                      />
                      <span className="font-semibold">{minimumScore}</span>
                    </label>
                    <label className="block text-sm">
                      <span className="text-xs font-semibold uppercase text-slate-500">
                        Max risk
                      </span>
                      <input
                        className="mt-2 w-full accent-ocean"
                        type="range"
                        min="0"
                        max="100"
                        value={maximumRisk}
                        onChange={(event) => setMaximumRisk(Number(event.target.value))}
                      />
                      <span className="font-semibold">{maximumRisk}</span>
                    </label>
                    <label className="block text-sm">
                      <span className="text-xs font-semibold uppercase text-slate-500">
                        Min quality
                      </span>
                      <input
                        className="mt-2 w-full accent-ocean"
                        type="range"
                        min="0"
                        max="100"
                        value={minimumQuality}
                        onChange={(event) => setMinimumQuality(Number(event.target.value))}
                      />
                      <span className="font-semibold">{minimumQuality}</span>
                    </label>
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold uppercase text-slate-500">Saved views</p>
                      <div className="mt-2 flex gap-2 overflow-x-auto">
                        {snapshot.savedViews.map((view) => (
                          <button
                            key={view.id}
                            className="min-h-11 shrink-0 rounded-md border border-line bg-paper px-3 py-2 text-sm font-semibold hover:bg-white"
                            type="button"
                            onClick={() => applySavedView(view)}
                          >
                            {view.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid min-w-0 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
                <AssetTable
                  assets={rankedAssets}
                  query={query}
                  selectedSymbol={selectedAsset?.symbol ?? selectedSymbol}
                  onQueryChange={setQuery}
                  onSelectAsset={setSelectedSymbol}
                />
                <AssetDetail asset={selectedAsset} context={assetContext} />
              </section>
            </>
          ) : null}

          {activeWorkspace === "portfolio" && portfolioSummary ? (
            <RiskLab
              summary={portfolioSummary}
              scenarioImpacts={scenarioImpacts}
              activeScenarioId={activeScenarioId}
              onSelectScenario={setActiveScenarioId}
            />
          ) : null}

          {activeWorkspace === "scenarios" ? (
            <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <ScenarioPanel
                scenarios={snapshot.scenarios}
                activeScenarioId={activeScenarioId}
                onSelectScenario={setActiveScenarioId}
              />
              <ScenarioMatrix scenarioImpacts={scenarioImpacts} />
            </section>
          ) : null}

          {activeWorkspace === "alerts" ? <AlertCenter snapshot={snapshot} /> : null}
        </div>
      </div>
    </main>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function isTerminalLiveStatus(
  status: LiveBriefStatus
): status is Extract<LiveBriefStatus, { status: "failed" | "cancelled" | "cancel_requested" }> {
  return (
    status.status === "failed" ||
    status.status === "cancelled" ||
    status.status === "cancel_requested"
  );
}

function HeaderPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-paper px-3 py-2">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold">{value}</p>
    </div>
  );
}

function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-semibold uppercase text-slate-500">{label}</span>
      <select
        className="mt-2 min-h-11 w-full rounded-md border border-line bg-paper px-3 py-2 font-semibold"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function OverviewQueue({ snapshot }: { snapshot: MarketSnapshot }) {
  const prioritizedAlerts = snapshot.alerts
    .filter((alert) => !alert.acknowledged)
    .sort((left, right) => {
      const order = { high: 3, medium: 2, low: 1 };
      return order[right.severity] - order[left.severity];
    });

  return (
    <section
      className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
      aria-labelledby="queue-title"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Desk queue</p>
          <h2 id="queue-title" className="mt-1 text-xl font-semibold">
            Alerts and events
          </h2>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-md border border-amber/30 bg-amber/10 text-amber">
          <CalendarClock aria-hidden="true" size={20} />
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold">Open alerts</h3>
          <div className="mt-3 space-y-2">
            {prioritizedAlerts.slice(0, 3).map((alert) => (
              <article key={alert.id} className="rounded-md border border-line bg-paper p-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold">{alert.title}</h4>
                  <span
                    className={clsx(
                      "rounded-full px-2 py-1 text-xs font-semibold",
                      severityTone(alert.severity) === "danger"
                        ? "bg-coral/10 text-coral"
                        : "bg-amber/10 text-amber"
                    )}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-5 text-slate-600">{alert.suggestedAction}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Next events</h3>
          <div className="mt-3 space-y-2">
            {snapshot.events.slice(0, 4).map((event) => (
              <article key={event.id} className="rounded-md border border-line bg-paper p-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold">{event.title}</h4>
                  <time className="text-xs font-semibold text-slate-500" dateTime={event.date}>
                    {event.date.slice(5)}
                  </time>
                </div>
                <p className="mt-2 text-sm text-slate-600">{event.symbols.join(", ")}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScenarioMatrix({
  scenarioImpacts
}: {
  scenarioImpacts: ReturnType<typeof buildScenarioImpacts>;
}) {
  return (
    <section
      className="rounded-lg border border-line bg-white p-4 shadow-dashboard"
      aria-labelledby="matrix-title"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">Portfolio stress</p>
          <h2 id="matrix-title" className="mt-1 text-xl font-semibold">
            Scenario matrix
          </h2>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-md border border-ocean/30 bg-ocean/10 text-ocean">
          <LineChart aria-hidden="true" size={20} />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[680px] w-full border-collapse text-left text-sm">
          <thead className="bg-paper text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-3">Scenario</th>
              <th className="px-3 py-3">Probability</th>
              <th className="px-3 py-3">Portfolio impact</th>
              <th className="px-3 py-3">Biggest drag</th>
              <th className="px-3 py-3">Offset</th>
            </tr>
          </thead>
          <tbody>
            {scenarioImpacts.map((impact) => (
              <tr key={impact.scenario.id} className="border-t border-line">
                <td className="px-3 py-3">
                  <span className="block font-semibold">{impact.scenario.name}</span>
                  <span className="block text-xs text-slate-500">{impact.scenario.horizon}</span>
                </td>
                <td className="px-3 py-3">{formatWeight(impact.scenario.probability)}</td>
                <td
                  className={
                    impact.totalImpact >= 0
                      ? "px-3 py-3 font-semibold text-mint"
                      : "px-3 py-3 font-semibold text-coral"
                  }
                >
                  {formatPct(impact.totalImpact)}
                </td>
                <td className="px-3 py-3">
                  {impact.biggestDrag
                    ? `${impact.biggestDrag.symbol} ${formatPct(impact.biggestDrag.contribution)}`
                    : "N/A"}
                </td>
                <td className="px-3 py-3">
                  {impact.biggestOffset
                    ? `${impact.biggestOffset.symbol} ${formatPct(impact.biggestOffset.contribution)}`
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
