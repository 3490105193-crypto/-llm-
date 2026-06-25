# Market Lens 功能介绍

Market Lens 是一个面向研究员和投资分析工作流的市场分析应用。它把市场状态、AI 大盘复盘、资产筛选、组合风险、情景压力测试和研究队列放在同一个工作台里，目标是帮助用户更快判断当前市场是否适合加仓、观望、降风险或继续深挖标的。

## 1. 市场总览

总览页用于快速判断当天市场状态。

- **Market cockpit**：展示当前市场 regime、样本更新时间、资产池数量、基准组合和 LLM 来源。
- **Market health**：用市场 regime、广度、动量、风险和信心综合生成健康分数。
- **Portfolio risk**：展示组合加权风险、beta 和对冲权重。
- **Scenario P/L**：展示当前主情景下的组合压力收益/损失。
- **Research open**：展示待处理研究任务和高优先级任务数量。

## 2. DSA Live LLM Cockpit

应用已经接入 `daily_stock_analysis` 的实时大盘复盘能力。

- **Run DSA live**：从首屏直接触发 live LLM 大盘复盘。
- **DSA live LLM cockpit**：展示当前 LLM 来源、任务状态、引擎、市场 stance、进度和摘要。
- **Open full brief**：跳转到完整 AI Brief 工作区查看详细结果。
- **安全边界**：浏览器只调用本地 adapter；LLM provider key 和付费数据 key 保留在 `daily_stock_analysis` 服务端。

运行 live LLM 需要三个进程：

```powershell
# daily_stock_analysis 仓库
python main.py --serve-only

# 当前仓库，本地 adapter
pnpm dev:live-api

# 当前仓库，前端
pnpm dev
```

默认地址：

- 前端：`http://127.0.0.1:5173`
- 本地 live adapter：`http://127.0.0.1:8787`
- `daily_stock_analysis`：`http://127.0.0.1:8000`

## 3. AI Brief

AI Brief 是完整的 LLM 市场复盘工作区。

- **DSA LLM market briefing**：展示 sample brief 或 live DSA brief。
- **Regime diagnostics**：拆解流动性、市场广度和风险预算。
- **Index narrative**：展示指数级别的市场叙事和驱动因素。
- **Sector calls**：展示行业轮动和板块 stance。
- **Stock action board**：展示股票级别 Buy、Watch、Hold、Reduce、Avoid 决策。
- **LLM warnings**：展示风险提示和建议动作。
- **Data quality**：展示数据新鲜度、缺失输入和信心说明。

## 4. Screener

Screener 用于快速筛选机会。

- 按 symbol、名称、行业、地区、资产类别搜索。
- 用最低评分、最高风险、最低质量过滤资产。
- 支持保存视图，例如高质量成长、低风险防御、宏观敏感资产等。
- 点击资产后进入右侧资产详情面板。

## 5. Asset Detail

资产详情面板用于快速形成单标的研究判断。

- 展示价格、涨跌幅、估值、质量、动量、波动率、流动性和风险。
- 展示投资 thesis、催化剂、watch flags 和 decision checklist。
- 展示因子暴露，包括 growth、value、quality、momentum、rates 和 USD。
- 聚合相关研究任务、事件和风险提醒。

## 6. Portfolio Risk Lab

组合风险工作区用于检查当前持仓暴露。

- 展示 gross exposure、active share、cash、hedge weight 和 weighted beta。
- 展示持仓权重、基准权重、主动权重和 conviction。
- 展示组合因子暴露。
- 和情景压力测试联动，用来判断风险是否集中。

## 7. Scenarios

情景工作区用于比较不同市场路径下的组合影响。

- 选择不同宏观/市场情景。
- 查看情景概率、时间范围、驱动因素和建议动作。
- 在 scenario matrix 中查看组合冲击、最大拖累、最大对冲来源。
- 支持从组合视角判断是否需要降低 beta、增加 hedge 或调整行业暴露。

## 8. Alerts And Research Queue

Alerts 工作区用于处理研究和风险队列。

- **Triage queue**：展示未确认风险提醒。
- **Due diligence**：展示待处理研究任务。
- **Event calendar**：展示财报、宏观、政策、公司和资金流事件。
- 每条提醒包含影响资产、触发条件、细节和建议动作。

## 9. 数据与验证

当前应用默认使用本地 seed market snapshot，因此没有 API key 也能运行。

- 使用 `zod` 验证市场快照。
- 使用 deterministic 前端分析逻辑计算分数、排序、组合风险和情景影响。
- live LLM 返回结果会映射到 `LlmMarketBrief` 合同后再渲染。

## 10. 工程与 AI 协作能力

项目已经配置 AI-native engineering workflow。

- `AGENTS.md`：AI 和开发者协作规则。
- `docs/repo-memory.md`：仓库长期记忆。
- `docs/module-map.md`：模块边界。
- `docs/architecture/`：架构说明、依赖、风险、技术债。
- `docs/decisions/`：ADR 架构决策记录。
- `docs/patterns/`：测试、安全和 AI workflow 模式。
- `tools/ai-quality.mjs`：AI workflow 质量检查。

质量门禁：

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

## 11. 当前边界

Market Lens 不是交易系统，也不是投顾系统。

- 不做下单、券商接入或投资建议。
- 不在浏览器保存 LLM provider key。
- 不包含用户账号、权限系统或数据库持久化。
- 当前 live DSA adapter 是本地集成边界，不是生产多用户后端。
