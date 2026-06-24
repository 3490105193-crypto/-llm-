import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { loadMarketSnapshot } from "../data/load-market-snapshot";
import { MarketDashboard } from "./MarketDashboard";

describe("MarketDashboard", () => {
  it("renders the research workbench", () => {
    render(<MarketDashboard snapshot={loadMarketSnapshot()} />);

    expect(screen.getByRole("heading", { name: /research workbench/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /institutional market cockpit/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /breadth map/i })).toBeInTheDocument();
  });

  it("filters the screener by user search", async () => {
    const user = userEvent.setup();
    render(<MarketDashboard snapshot={loadMarketSnapshot()} />);

    await user.click(screen.getByRole("button", { name: /screener/i }));
    await user.type(screen.getByRole("searchbox", { name: /search assets/i }), "NVDA");

    expect(screen.getByRole("button", { name: /NVDA NVIDIA/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /MSFT Microsoft/i })).not.toBeInTheDocument();
  });

  it("supports portfolio, scenario, and alert workspaces", async () => {
    const user = userEvent.setup();
    render(<MarketDashboard snapshot={loadMarketSnapshot()} />);

    await user.click(screen.getByRole("button", { name: /portfolio/i }));
    expect(screen.getByRole("heading", { name: /risk lab/i })).toBeInTheDocument();
    expect(screen.getByText(/gross exposure/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ai brief/i }));
    expect(screen.getByRole("heading", { name: /llm market briefing/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /stock action board/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /scenarios/i }));
    expect(screen.getByRole("heading", { name: /scenario matrix/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /alerts/i }));
    expect(screen.getByRole("heading", { name: /triage queue/i })).toBeInTheDocument();
    expect(screen.getByText(/revision risk unresolved/i)).toBeInTheDocument();
  });

  it("shows a validated data error state", () => {
    render(<MarketDashboard snapshot={null} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Market data unavailable");
  });
});
