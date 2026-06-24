import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const requiredPaths = [
  "AGENTS.md",
  "README.md",
  "SECURITY.md",
  ".editorconfig",
  ".gitattributes",
  ".gitignore",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "index.html",
  "vite.config.ts",
  "vitest.config.ts",
  "playwright.config.ts",
  "src/main.tsx",
  "src/App.tsx",
  "src/AppErrorBoundary.tsx",
  "src/features/market/schemas.ts",
  "src/features/market/analysis.ts",
  "src/features/market/data/load-market-snapshot.ts",
  "src/features/market/data/seed-market.ts",
  "src/features/market/components/MarketDashboard.tsx",
  "e2e/market-dashboard.spec.ts",
  "docs/repo-memory.md",
  "docs/module-map.md",
  "docs/architecture/overview.md",
  "docs/architecture/product-goals.md",
  "docs/architecture/repo-memory.md",
  "docs/architecture/module-map.md",
  "docs/architecture/dependencies.md",
  "docs/architecture/risk-register.md",
  "docs/architecture/technical-debt.md",
  "docs/decisions/0001-ai-native-baseline.md",
  "docs/decisions/0002-defer-runtime-test-tooling.md",
  "docs/decisions/0003-adopt-lifecycle-engineering-rules.md",
  "docs/decisions/0004-market-lens-frontend-stack.md",
  "docs/decisions/template.md",
  "docs/patterns/ai-engineering-workflow.md",
  "docs/patterns/testing.md",
  "docs/patterns/security.md",
  "tests/README.md",
  "e2e/README.md",
  ".codex/skills/project-engineering-workflow/SKILL.md",
  ".codex/skills/project-engineering-workflow/agents/openai.yaml",
  "tools/ai-quality.ps1",
  "tools/ai-quality.mjs"
];

const textExtensions = new Set([
  ".css",
  ".html",
  ".json",
  ".md",
  ".mjs",
  ".ps1",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml"
]);

const excludedDirs = new Set([
  ".git",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results"
]);

const secretPatterns = [
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
  /gh[pousr]_[A-Za-z0-9_]{36,}/,
  /github_pat_[A-Za-z0-9_]{80,}/,
  /sk-[A-Za-z0-9_-]{24,}/,
  /xox[baprs]-[A-Za-z0-9-]{20,}/
];

const missing = requiredPaths.filter((path) => !existsSync(join(root, path)));
if (missing.length > 0) {
  fail("Missing required baseline paths", missing);
}

const files = [];
walk(root, files);

const placeholderHits = [];
const trailingWhitespaceHits = [];
const secretHits = [];
const placeholderPattern = "[" + "TODO";

for (const file of files) {
  const stats = statSync(file);
  if (stats.size > 1024 * 1024) {
    continue;
  }

  const content = readFileSync(file, "utf8");
  const relativePath = relative(root, file);

  if (content.includes(placeholderPattern)) {
    placeholderHits.push(relativePath);
  }

  content.split(/\r?\n/).forEach((line, index) => {
    if (/[ \t]+$/.test(line)) {
      trailingWhitespaceHits.push(`${relativePath}:${index + 1}`);
    }
  });

  for (const pattern of secretPatterns) {
    if (pattern.test(content)) {
      secretHits.push(`${relativePath} matched ${pattern.source}`);
    }
  }
}

if (placeholderHits.length > 0) {
  fail("Template placeholders remain", unique(placeholderHits));
}

if (trailingWhitespaceHits.length > 0) {
  fail("Trailing whitespace found", unique(trailingWhitespaceHits));
}

if (secretHits.length > 0) {
  fail("Potential secrets found", unique(secretHits));
}

console.log("AI quality gate passed.");

function walk(directory, output) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!excludedDirs.has(entry.name)) {
        walk(join(directory, entry.name), output);
      }
      continue;
    }

    if (entry.isFile() && textExtensions.has(extname(entry.name))) {
      output.push(join(directory, entry.name));
    }
  }
}

function unique(values) {
  return [...new Set(values)].sort();
}

function fail(title, lines) {
  console.error(`${title}:\n${lines.join("\n")}`);
  process.exit(1);
}
