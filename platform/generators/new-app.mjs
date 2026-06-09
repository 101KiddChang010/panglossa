#!/usr/bin/env node
/**
 * platform/generators/new-app.mjs
 *
 * Scaffolds a new TypeScript app under products/apps/ or products/labs/
 *
 * Usage:
 *   node platform/generators/new-app.mjs --name=my-app --type=app
 *   node platform/generators/new-app.mjs --name=my-experiment --type=lab
 */

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace("--", "").split("=");
    return [key, value];
  })
);

const { name, type = "app" } = args;

if (!name) {
  console.error("Error: --name is required");
  console.error("Usage: node platform/generators/new-app.mjs --name=my-app --type=app|lab");
  process.exit(1);
}

if (!["app", "lab"].includes(type)) {
  console.error("Error: --type must be 'app' or 'lab'");
  process.exit(1);
}

const basePath = join(process.cwd(), "products", type === "app" ? "apps" : "labs", name);

const files = {
  "package.json": JSON.stringify(
    {
      name: `@panglossa/${name}`,
      version: "0.0.0",
      private: true,
      type: "module",
      scripts: {
        dev: "tsc --watch",
        build: "tsc",
      },
      devDependencies: {
        typescript: "^5.4.0",
      },
    },
    null,
    2
  ),

  "tsconfig.json": JSON.stringify(
    {
      extends: "../../tsconfig.json",
      compilerOptions: {
        outDir: "dist",
        rootDir: "src",
      },
      include: ["src"],
    },
    null,
    2
  ),

  "BUILD.bazel": `load("@aspect_rules_ts//ts:defs.bzl", "ts_project")

ts_project(
    name = "${name}",
    srcs = glob(["src/**/*.ts"]),
    tsconfig = "tsconfig.json",
    visibility = ["//visibility:public"],
)
`,

  "README.md": `# ${name}\n\n> Add a description here.\n`,

  "src/index.ts": `// ${name}\n`,
};

async function scaffold() {
  await mkdir(join(basePath, "src"), { recursive: true });

  for (const [filename, content] of Object.entries(files)) {
    await writeFile(join(basePath, filename), content);
    console.log(`  created ${join("products", type === "app" ? "apps" : "labs", name, filename)}`);
  }

  console.log(`\n✓ Scaffolded ${type === "app" ? "app" : "lab"}: ${name}`);
  console.log(`  Location: products/${type === "app" ? "apps" : "labs"}/${name}`);
  console.log(`  Next: cd into the directory and start building.\n`);
}

scaffold().catch((err) => {
  console.error("Scaffolding failed:", err);
  process.exit(1);
});
