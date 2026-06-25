# Market Lens

Market Lens 是一个 AI-native 的市场分析工作台，用于扫描市场状态、AI 大盘复盘、资产机会、组合风险、情景压力测试和研究队列。

它不是一个交易系统，也不是投顾系统。当前应用默认使用本地验证过的 seed market snapshot，因此无需 API key、券商账号或付费行情也可以运行。可选的 live LLM 能力通过本地 adapter 接入 `daily_stock_analysis`，浏览器不会保存或暴露 LLM provider key。

## 核心功能

### 市场总览

- 展示当前市场 regime、资产池数量、组合基准和 LLM 来源。
- 计算 market health、portfolio risk、scenario P/L 和 open research count。
- 首屏提供 `Run DSA live`，可以直接触发实时 LLM 大盘复盘。

### DSA Live LLM Cockpit

- 调用本地 adapter 提交 `daily_stock_analysis` market-review 任务。
- 展示任务状态、进度、LLM engine、market stance 和摘要。
- 支持跳转到完整 AI Brief 工作区。
- LLM provider key 和付费数据 key 保留在 `daily_stock_analysis` 服务端。

### AI Brief

- 展示 sample brief 或 live DSA brief。
- 拆解市场 stance、confidence、liquidity、breadth 和 risk budget。
- 展示 index narrative、sector rotation、stock action board、LLM risk warnings 和 data quality。

### Screener

- 按 symbol、名称、行业、地区、资产类别搜索。
- 支持最低评分、最高风险、最低质量过滤。
- 支持 saved views，快速切换不同研究视角。
- 点击资产后进入资产详情面板。

### Asset Detail

- 展示价格、涨跌幅、估值、质量、动量、波动率、流动性和风险。
- 展示 thesis、catalysts、watch flags 和 decision checklist。
- 展示 growth、value、quality、momentum、rates、USD 等因子暴露。
- 聚合相关 alerts、events 和 research tasks。

### Portfolio Risk Lab

- 展示 gross exposure、active share、cash、hedge weight 和 weighted beta。
- 展示持仓权重、基准权重、主动权重和 conviction。
- 展示组合因子暴露，辅助判断风险是否集中。

### Scenarios

- 比较不同宏观/市场情景下的组合影响。
- 展示情景概率、时间范围、驱动因素和建议动作。
- 在 scenario matrix 中查看组合冲击、最大拖累和最大对冲来源。

### Alerts And Research Queue

- 展示未确认风险提醒。
- 展示待处理研究任务。
- 展示财报、宏观、政策、公司和资金流事件。
- 每条提醒包含影响资产、触发条件、细节和建议动作。

更完整的中文功能说明见 [docs/features.md](docs/features.md)。

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- zod
- Vitest
- React Testing Library
- Playwright
- pnpm
- Node.js local adapter
- Optional LLM engine: `3490105193-crypto/daily_stock_analysis`

## 项目结构

```text
src/
  App.tsx
  AppErrorBoundary.tsx
  features/market/
    analysis.ts
    schemas.ts
    data/
    components/
server/
  live-llm-server.mjs
docs/
  architecture/
  decisions/
  patterns/
  features.md
e2e/
tests/
tools/
```

重要文档：

- [AGENTS.md](AGENTS.md)：AI 和开发者协作规则。
- [docs/repo-memory.md](docs/repo-memory.md)：仓库长期记忆。
- [docs/module-map.md](docs/module-map.md)：模块边界和数据流。
- [docs/architecture/](docs/architecture/)：架构、依赖、风险和技术债。
- [docs/decisions/](docs/decisions/)：ADR 架构决策记录。
- [docs/patterns/](docs/patterns/)：测试、安全和 AI workflow 模式。

## 本地启动

安装依赖：

```powershell
pnpm install
```

启动前端：

```powershell
pnpm dev
```

默认地址：

```text
http://127.0.0.1:5173
```

## Live LLM 启动

实时 LLM 大盘复盘需要三个进程分别运行。

```powershell
# 1. 在 daily_stock_analysis 仓库中启动 FastAPI 服务
python main.py --serve-only

# 2. 在本仓库启动 Market Lens 本地 adapter
pnpm dev:live-api

# 3. 在本仓库启动前端
pnpm dev
```

默认端点：

- Frontend: `http://127.0.0.1:5173`
- Market Lens live adapter: `http://127.0.0.1:8787`
- daily_stock_analysis FastAPI: `http://127.0.0.1:8000`

环境变量见 [.env.example](.env.example)。

关键变量：

```text
VITE_LIVE_LLM_API_BASE=http://127.0.0.1:8787
DSA_BASE_URL=http://127.0.0.1:8000
LIVE_LLM_PORT=8787
LIVE_LLM_REPORT_LANGUAGE=en
```

## Scripts

```powershell
pnpm dev
pnpm dev:live-api
pnpm start
pnpm lint
pnpm typecheck
pnpm format
pnpm format:write
pnpm test
pnpm test:coverage
pnpm build
pnpm audit:deps
pnpm e2e
pnpm quality
```

## 测试与质量门禁

推荐提交前运行：

```powershell
pnpm format
pnpm lint
pnpm typecheck
pnpm test:coverage
pnpm build
pnpm audit:deps
pnpm e2e
pnpm quality
```

测试覆盖：

- `src/features/market/analysis.test.ts`：市场评分、排序、组合风险和情景逻辑。
- `src/features/market/components/MarketDashboard.test.tsx`：主工作台行为和错误状态。
- `src/features/market/data/live-llm-client.test.ts`：live adapter client 校验。
- `server/live-llm-server.test.mjs`：DSA status 兼容和 brief 映射。
- `e2e/market-dashboard.spec.ts`：桌面和移动端 smoke tests。

## 安全边界

- 浏览器不保存 LLM provider key。
- 浏览器只调用本地 live adapter。
- live adapter 只调用配置的 `DSA_BASE_URL`。
- 所有 live brief 结果会映射到 `LlmMarketBrief` 合同后再渲染。
- `.env` 不应提交，环境变量只通过 `.env.example` 记录。

## 当前限制

- 默认数据是本地 sample snapshot，不是实时行情。
- live DSA adapter 是本地集成边界，不是生产多用户后端。
- 当前没有用户账号、数据库、权限系统、券商接入或订单系统。
- 当前输出不构成投资建议。

## 推荐下一步

- 为真实 DSA completed payload 建立 fixture test suite。
- 为 live adapter 增加结构化日志和运行指标。
- 如果要生产部署，增加 auth、rate limit、observability 和更明确的 DSA payload contract。
- 引入真实市场数据前，先明确数据授权、freshness、缓存和错误处理策略。
