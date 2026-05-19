---
name: bump-transitive-dependency
description: Bump a transitive dependency to a patched version using pnpm. Use when Dependabot reports a security vulnerability in a transitive dependency and cannot auto-update it, or when the user mentions bumping, upgrading, or patching a transitive dependency.
---

# Bump Transitive Dependency

pnpm cannot update transitive dependencies directly, so dependabot can't either. This skill works around that limitation by temporarily adding the package as a direct dependency, deduplicating, then removing it.

## Input

The user provides at minimum:

- **Package name** (e.g. `markdown-it`)

Optionally:

- **Patched version** (e.g. `14.1.1`)
- **Affected version range** (e.g. `>= 13.0.0, < 14.1.1`)

## Locations

Run the procedure in **both** the root project and the `example/` directory. The dependency may only exist in one of them. For each location:

- If `pnpm why <package>` shows no results, skip that location and note it in the final report.
- Otherwise, run the full procedure below.

Use `--dir` to target each location (e.g. `pnpm --dir example why <package>`), or `cd` as appropriate.

## Steps (per location)

1. **Check for the dependency**:
   Run `pnpm why <package>`. If it isn't found, skip this location.

2. **Verify the vulnerability** (if version info was provided):
   Confirm the currently resolved version falls within the affected range.

3. **Add the package as a direct dependency**:

   ```bash
   pnpm add <package>
   ```

   If a specific patched version was provided, pin to at least that version:

   ```bash
   pnpm add <package>@^<patched-version>
   ```

4. **Deduplicate**:

   ```bash
   pnpm dedupe
   ```

5. **Remove the direct dependency**:

   ```bash
   pnpm remove <package>
   ```

   This leaves the bumped transitive resolution in the lockfile.

6. **Verify the fix**:
   Run `pnpm why <package>` again to confirm the resolved version is now at or above the patched version.

## Reporting

Report results for both locations, showing before/after versions for each. If the dependency wasn't present in a location, note that explicitly.
