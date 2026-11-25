import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "src/lib/**/*.{ts,tsx}",
        "src/app/invite-request/route.ts",
        "src/app/auth/signout/route.ts",
        "src/proxy.ts",
        "src/components/SeverityPill.tsx",
        "src/components/InviteForm.tsx",
        "src/components/LookoutReport.tsx",
        "src/components/Analyzer.tsx",
        "src/components/BrandMark.tsx",
        "src/components/MiddletownFlag.tsx",
        "src/components/UserBar.tsx",
      ],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/lib/report-types.ts",
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
