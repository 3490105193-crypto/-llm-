import { seedMarketSnapshot } from "./seed-market";
import { MarketSnapshotSchema, type MarketSnapshot } from "../schemas";

export function loadMarketSnapshot(input: unknown = seedMarketSnapshot): MarketSnapshot {
  return MarketSnapshotSchema.parse(input);
}
