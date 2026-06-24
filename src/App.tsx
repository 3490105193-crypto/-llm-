import { MarketDashboard } from "@/features/market/components/MarketDashboard";
import { loadMarketSnapshot } from "@/features/market/data/load-market-snapshot";

export function App() {
  const snapshot = loadMarketSnapshot();

  return <MarketDashboard snapshot={snapshot} />;
}
