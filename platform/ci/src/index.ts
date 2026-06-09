import { dag, Container, Directory, object, func } from "@dagger.io/dagger";

@object()
export class Panglossa {
  /**
   * Run the full CI pipeline: install → lint → build → test
   */
  @func()
  async ci(source: Directory): Promise<string> {
    const base = await this.base(source);
    await this.lint(base);
    await this.build(base);
    return this.test(base);
  }

  /**
   * Base container with dependencies installed
   */
  @func()
  async base(source: Directory): Promise<Container> {
    return dag
      .container()
      .from("node:20.11-alpine")
      .withExec(["corepack", "enable"])
      .withExec(["corepack", "prepare", "pnpm@9.0.0", "--activate"])
      .withMountedDirectory("/app", source)
      .withWorkdir("/app")
      .withExec(["pnpm", "install", "--frozen-lockfile"]);
  }

  /**
   * Run ESLint + Prettier check
   */
  @func()
  async lint(base: Container): Promise<string> {
    return base
      .withExec(["pnpm", "lint"])
      .withExec(["pnpm", "exec", "prettier", "--check", "."])
      .stdout();
  }

  /**
   * Run Bazel build
   */
  @func()
  async build(base: Container): Promise<string> {
    return base
      .withExec(["pnpm", "build"])
      .stdout();
  }

  /**
   * Run Bazel tests
   */
  @func()
  async test(base: Container): Promise<string> {
    return base
      .withExec(["pnpm", "test"])
      .stdout();
  }
}
