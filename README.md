# QA Automation · Playwright + TypeScript

UI and API test automation against two public demo apps:

| Suite | Target | What it covers |
|---|---|---|
| `ui` | [saucedemo.com](https://www.saucedemo.com) | login rules, product list, cart, checkout, network failures |
| `api` | [restful-booker](https://restful-booker.herokuapp.com/apidoc/index.html) | auth, CRUD, schema validation, negative cases |

## Run it

```bash
npm ci
npx playwright install chromium
npm test              # everything
npm run test:ui       # saucedemo only
npm run test:api      # restful-booker only
npm run report        # open the last HTML report
```

Credentials are the demo sites' own published test accounts. To override them, copy `.env.example` to `.env`.

## Structure

```
src/
  pages/      Page Objects: one class per screen, locators + user actions
  fixtures/   test.extend(): tests receive page objects and the API client as fixtures
  api/        BookingClient (one method per endpoint) + zod schemas
  data/       test data and builders (unique names per run)
tests/
  auth.setup.ts   logs in once; the ui suite reuses the saved session (storageState)
  ui/             login, cart, checkout, network control
  api/            booking API
.github/workflows/playwright.yml   CI on every push / PR, HTML report published to GitHub Pages
```

## Design decisions

- **Locators**: `getByTestId` / `getByRole` only, no CSS or XPath chains. saucedemo marks elements with `data-test`, set as `testIdAttribute` in the config.
- **One login, many tests**: a `setup` project signs in once and saves `storageState`; login tests opt out with an empty state.
- **Schemas over spot checks**: API responses are parsed with zod, so a missing or mistyped field fails the test with a clear message.
- **Parallel-safe data**: every booking gets a unique name, so runs never depend on each other or on other people using the shared demo API.
- **Data-driven negatives**: required-field cases are generated from a small table instead of copy-pasted tests.
- **Failure evidence**: on CI, failed tests keep a trace, screenshot and video; retries are on in CI only so flakiness stays visible locally.

## Roadmap

- [ ] Hybrid test: create data through an API, verify it in a UI
- [ ] Visual checks (`toHaveScreenshot`) and accessibility (`@axe-core/playwright`)
- [ ] Sharding on CI
- [ ] k6 smoke load test
