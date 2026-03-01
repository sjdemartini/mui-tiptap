---
name: fix-security-vulnerabilities
description: Fetch all open security vulnerabilities from Dependabot (or pnpm audit as fallback) and bump every affected dependency to its patched version. Use when the user asks to fix, resolve, or address all security vulnerabilities, Dependabot alerts, or audit findings.
---

# Fix Security Vulnerabilities

Fetch every open vulnerability for this repo and resolve them by bumping each affected package to its patched version. Transitive dependency bumps follow the procedure in the sibling [bump-transitive-dependency](../bump-transitive-dependency/SKILL.md) skill.

## Step 1 — Gather open vulnerabilities

### Primary: GitHub Dependabot API

```bash
gh api repos/{owner}/{repo}/dependabot/alerts \
  --paginate \
  --jq '[.[] | select(.state == "open")] | .[] | {
    number,
    package:          .dependency.package.name,
    relationship:     .dependency.relationship,
    manifest:         .dependency.manifest_path,
    severity:         .security_vulnerability.severity,
    vulnerable_range: .security_vulnerability.vulnerable_version_range,
    patched:          .security_vulnerability.first_patched_version.identifier
  }'
```

Derive `{owner}/{repo}` from the git remote:

```bash
gh repo view --json nameWithOwner --jq '.nameWithOwner'
```

### Fallback: pnpm audit

If the `gh` command fails (no token, not a GitHub repo, etc.), use:

```bash
pnpm audit --json
```

Parse the `advisories` and `actions` objects to extract package names, patched versions, and severity.

## Step 2 — Deduplicate and plan

Multiple alerts often target the same package (different CVEs, different manifests). Group alerts by **package name** and for each group pick the **highest patched version** across all its alerts. This becomes the target version.

Build a table for the user:

| Package | Current alerts | Severity | Target version | Relationship |
| ------- | -------------- | -------- | -------------- | ------------ |
| …       | #70, #75       | high     | 9.0.7          | transitive   |

Present this plan and proceed unless the user objects.

## Step 3 — Fix each package

### Transitive dependencies

For each transitive dependency, follow the **bump-transitive-dependency** skill procedure. Briefly:

1. In **both** the repo root and `example/` (skip a location if `pnpm why <package>` shows nothing):

   ```bash
   pnpm add <package>@^<target-version>
   pnpm dedupe
   pnpm remove <package>
   ```

2. Verify with `pnpm why <package>`.

Read the full procedure in [bump-transitive-dependency/SKILL.md](../bump-transitive-dependency/SKILL.md) if you haven't already.

### Direct dependencies

If the dependency is direct (`relationship: "direct"`):

1. Update the version in `package.json` (or `example/package.json`).
2. Run `pnpm install` in the appropriate location.
3. Verify with `pnpm why <package>`.

## Step 4 — Verify

After all bumps, re-run the audit to confirm fixes:

```bash
pnpm audit
```

Also run in `example/` if it has its own lockfile:

```bash
pnpm --dir example audit
```

Some advisories may remain if the only fix requires a semver-major upgrade of a direct dependency. Note these as **unresolvable without a breaking upgrade** in the report.

## Step 5 — Report

Summarize results:

| Package | Before | After | Alerts resolved | Location(s) |
| ------- | ------ | ----- | --------------- | ----------- |
| …       | 9.0.4  | 9.0.7 | #70, #75        | root        |

List any alerts that could not be resolved and why (e.g., major version bump required, package pinned by another dependency).
