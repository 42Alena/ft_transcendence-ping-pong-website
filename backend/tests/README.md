
# Tests

This folder contains backend test files. You can run **all tests** or a **single test** (TypeScript `.ts` or shell `.sh`) as shown below.

> **Paths:** if your tests live under `backend/src/tests/`, keep the examples as-is.
> If they live under `backend/tests/`, replace `src/tests` with `tests`.

---

## Prerequisites

* Node.js + npm installed
* Dev deps: `ts-node` (or `tsx`) available via project `devDependencies`
* A valid `tsconfig.json` in the backend folder

---

## Run all tests (from repo root)

Using the provided Make target:

```bash
make backend-tests
```

What it does internally (from `$(BACKEND_DIR)`):

```bash
npm run backend-tests
```

Your `package.json` script is expected to be one of:

```json
{
  "scripts": {
    // If tests are under backend/src/tests
    "backend-tests": "ts-node src/tests/*.ts"

    // If tests are under backend/tests (alternate)
    // "backend-tests": "ts-node tests/*.ts"
  }
}
```

> Prefer `ts-node` or `tsx` consistently—don’t mix both in scripts.

---

## Run a single TypeScript test

From the backend folder (so paths resolve cleanly):

```bash
# If using ts-node
npx ts-node src/tests/<test-name>.ts

# If you use tsx instead of ts-node
npx tsx src/tests/<test-name>.ts
```

Examples:

```bash
npx ts-node src/tests/user.register.test.ts
npx tsx src/tests/chat.blocking.test.ts
```

### Tips for TS tests

* Top of each test can be plain TS; no special runner is required for simple scripts.
* Use `process.exit(0)` on success and non-zero on failure to integrate with CI/Make.

---

## Run a single shell test (`.sh`)

Make it executable once:

```bash
chmod +x src/tests/<test-name>.sh
```

Run it:

```bash
./src/tests/<test-name>.sh
```

Recommended header for reliable shell tests:

```bash
#!/usr/bin/env bash
set -euo pipefail
# your test logic here
```

---

## Common layouts

* **TypeScript tests:** `backend/src/tests/*.ts`
* **Shell tests:** `backend/src/tests/*.sh`

If you change folder layout, update:

* the `backend-tests` script in `package.json`
* any paths in this README
* the `make backend-tests` recipe if it assumes a specific path

---

## Troubleshooting

* **“Cannot find module”**: run from the backend directory or fix relative imports.
* **ESM vs CJS errors**: align `ts-node`/`tsx` with your `tsconfig.json` + `package.json` (`type: "module"` or not).
* **Glob not matching**: confirm the script uses the correct folder (`src/tests/*.ts` vs `tests/*.ts`).
