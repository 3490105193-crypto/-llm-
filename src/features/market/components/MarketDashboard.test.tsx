import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { loadMarketSnapshot } from "../data/load-market-snapshot";
import { MarketDashboard } from "./MarketDashboard";

describe("MarketDashboard", () => {
  it("renders the market command center", () => {
    render(<MarketDashboard snapshot={loadMarketSnapshot()} />);

    expect(screen.getByRole("heading", { name: /market command center/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /signal rank/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /breadth map/i })).toBeInTheDocument();
  });

  it("filters the watchlist by user search", async () => {
    const user = userEvent.setup();
    render(<MarketDashboard snapshot={loadMarketSnapshot()} />);

    await user.type(screen.getByRole("searchbox", { name: /search assets/i }), "NVDA");

    expect(screen.getByRole("button", { name: /NVDA NVIDIA/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /MSFT Microsoft/i })).not.toBeInTheDocument();
  });

  it("shows a validated data error state", () => {
    render(<MarketDashboard snapshot={null} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Market data unavailable");
  });
});
