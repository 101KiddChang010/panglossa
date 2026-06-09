# Panglossa

A nx monorepo that increases application development velocity. Pick your language/framework, follow proven patterns, ship fast. Built on CI/CD, infrastructure, and developer tooling—designed so developers can scale from first commit to production.

## Prerequisites

- [NX]() >= 
- [Node.js](https://nodejs.org) >= 20.11
- [pnpm](https://pnpm.io) >= 9.0
- [Dagger CLI](https://docs.dagger.io/install)

## Getting started

```bash
# Install dependencies
pnpm install

# Build everything
bazel build //...

# Run tests
bazel test //...

# Scaffold a new app
node platform/generators/new-app.mjs --name=my-app --type=app

# Scaffold a new lab
node platform/generators/new-app.mjs --name=my-experiment --type=lab
```

## Architecture

See [`adr/`](./adr/) for all architectural decisions.
