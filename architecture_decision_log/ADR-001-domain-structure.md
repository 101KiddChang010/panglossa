# ADR-002: Four-Domain Repository Structure

- **Date:** 06-02-2026
- **Status:** Accepted

## Context

A nx monorepo housing applications, shared libraries, developer tooling, and cloud infrastructure requires clear architectural boundaries. Without explicit domain separation, dependency graphs become tangled, ownership becomes unclear, and the blast radius of changes becomes unpredictable.

## Decision

The repository is structured around four top-level domains with strictly enforced boundaries:

- **`products/`** — user-facing applications and learning projects. Leaf nodes — nothing depends on them.
- **`shared/`** — imported code (utilities, domain libraries, contracts/schemas). The only upward dependency in the graph.
- **`platform/`** — developer tooling, CI pipelines, generators, and local DX. Serves developers, not deployed systems.
- **`infrastructure/`** — cloud resources, Kubernetes manifests, deployment automation, and observability infrastructure. Serves deployed systems.

CI/CD is split: CI pipeline definitions live in `platform/ci/`, deployment automation lives in `infrastructure/cd/`.

## Consequences

- Adding a new package requires a conscious decision about which domain it belongs to
- Boundary violations are detectable via Bazel visibility rules (to be enforced in a future ADR)
- The structure scales to a team of 3–5 owners per domain without restructuring
