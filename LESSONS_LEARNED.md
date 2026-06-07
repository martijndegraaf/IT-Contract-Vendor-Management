# Lessons Learned — PVSP

> Last updated: 2026-06-07  
> These lessons exist because they cost real time to learn. Read them before starting any sprint.

---

## Architecture

### Adding a new view requires 5 registration points — all of them

**Category**: architecture  
**Context**: PVSP navigation is wired manually across five independent locations in `index.html`. There is no central registry that auto-discovers views.  
**What went wrong**: Missing any one of the five causes silent failures — views that 404, roles that silently lose access, or admin panels that can't configure the new view.  
**Rule**: Every new navigable view must be added in all five places, in this order:

| # | What | Location in index.html |
|---|------|------------------------|
| 1 | `<button class="nav-item" data-view="<key>">` | Sidebar HTML (~line 730) |
| 2 | `<div class="view" id="view-<key>">` | View container HTML |
| 3 | `case "<key>": render<Module>(); break` | `renderCurrentView()` switch (~line 1979) |
| 4 | `{key:"<key>", label:"<Label>"}` entry | `ADMIN_VIEWS` array (~line 6171) |
| 5 | `"<key>": "rw"|"ro"|null` for **every** role row | `RBAC_MATRIX` object (~line 6162) |

Step 5 is most often forgotten. Missing a role entry returns `null` (no access) silently.

**How to check**: After adding a view, run this in DevTools console:
```js
const key = "your-view-key";
Object.entries(RBAC_MATRIX).forEach(([role, perms]) => {
  if (!(key in perms)) console.warn(`MISSING: ${role} has no entry for "${key}"`);
});
```
Also verify `VIEW_TITLES` (~line 1776) includes the key if you want a topbar label.

---

### File size is already over target — don't add bloat

**Category**: architecture  
**Context**: PVSP is a single HTML file. Current size: **788,893 bytes** (over the 750KB target).  
**What went wrong**: Inline SVG assets and large blocks of generated HTML have pushed the file above a comfortable threshold. Load time and edit experience both degrade further as it grows.  
**Rule**: Never inline SVG assets larger than 2KB. Use CSS-drawn icons or CDN references instead. After every sprint, check: `wc -c index.html`. If over 800KB, identify and trim what grew before merging.

---

## Data & State

### Never change the localStorage schema without a version bump and migration

**Category**: data  
**Context**: All app state is stored in one localStorage key. The key and version are defined at line 7728:
```js
var STORAGE_KEY = "pvsp_v59_data"
// version checked in loadFromStorage:
if(!data || data.version !== "6.0") return false
```
`saveToStorage()` serialises: `VENDORS`, `TASKS`, `RISKS`, `DOCUMENTS`, `MEETINGS`, `PLAYBOOKS`, `USERS`, `TEAM_ASSIGNMENTS`, `RENEWAL_DATA`, `RBAC_MATRIX`, `ALERT_THRESHOLDS`, `_adminPassword`.

**What went wrong**: Schema changes without a migration silently invalidate existing stored sessions — `loadFromStorage()` returns `false` and the app resets to default data. Users lose all their work.

**Rule**: Any time the schema changes (adding, renaming, or removing a field):
1. Bump `STORAGE_KEY` to the next version (e.g. `pvsp_v60_data`) AND bump `version` inside `saveToStorage()`
2. Add a migration block inside `loadFromStorage()` — read the old structure, fill in the new field with a sensible default. See the existing `contacts` migration around line 7770 as the pattern to follow.
3. Test by loading a saved session from before the change and verifying nothing breaks.

**How to check**: If you need to manually clear storage during testing, that's a signal a migration is missing.

---

### Secondary localStorage keys — don't forget them

**Category**: data  
**Context**: Besides `pvsp_v59_data`, there are two additional localStorage keys used for preferences:
- `pvsp_ct_prefs_v1` — contract table column preferences (~line 10382)
- `pvsp_api_config_v1` — AI/API configuration (~line 10731)
- `pvsp_tour_seen` — onboarding tour flag (~line 11651)
- `pvsp_remember` — remember-me flag (~line 8133)

**Rule**: If you rename or restructure any of these, handle the old key the same way as the main schema — read, migrate, write. Don't orphan old keys.

---

## UI & Styling

### Always prefix CSS classes with a feature name

**Category**: ui  
**Context**: All styles live in a single `<style>` block. There is no scoping or module system.  
**What went wrong**: Generic class names like `.badge`, `.card`, `.tag` added for one feature override styles from another feature that uses the same name.  
**Rule**: Every new CSS class must be prefixed with its feature name — `.renewal-badge`, `.vendor-badge`, `.budget-row` — never bare generic names.  
**How to check**: Before adding any new class name, `Ctrl+F` the `<style>` block for that name. If it already exists, use a more specific prefix.

---

## RBAC & Permissions

### The RBAC matrix is the source of truth — always check it before building anything access-related

**Category**: rbac  
**Context**: `RBAC_MATRIX` (~line 6162) controls what each of the 5 roles (cm, ce, po, slm, mgr) can do in every view. `getAccess(view)` at line 1847 reads from this matrix live — including any admin-panel overrides saved to localStorage. The `applyRBAC()` function at line 1855 runs on every persona switch and enforces visibility.  
**What went wrong**: Features built assuming a role has access, without verifying the matrix first, caused access regressions that were only caught during demos.  
**Rule**: Before building any view or action that involves access control, read the `RBAC_MATRIX` block and confirm the access levels for every relevant role. Don't assume — check.

**Current matrix (as of 2026-06-07):**
```
        dashboard  vendors  contracts  renewal  tasks  governance  documents  risklog  aitools  alerts  analytics  contacts  admin
cm:       rw         rw        rw        rw      rw       rw          rw        rw       rw       rw       rw         rw      null
ce:       rw         ro        rw        rw      null     rw          rw        ro       rw       rw       rw         rw      null
po:       rw         ro        ro        ro      rw       null        ro        null     rw       rw       rw         ro      null
slm:      rw         ro        ro        null    rw       rw          ro        rw       rw       rw       rw         rw      null
mgr:      rw         rw        rw        rw      rw       rw          rw        rw       null     rw       rw         rw       rw
```

---

## Workflow & Process

### Test all 5 personas after every sprint

**Category**: workflow  
**Context**: PVSP has 5 personas with meaningfully different access levels. Features that work for CM often silently break for SLM or PO.  
**What went wrong**: Testing only with the CM persona (the most permissive role) missed access regressions that were caught during client demos.  
**Rule**: After every sprint, do a 5-minute smoke test with each persona using the persona switcher in Admin. Checklist:
- [ ] CM (Annet de Vries) — rw on most views
- [ ] CE (Bas Hendriks) — no tasks access, read-only vendors
- [ ] PO (Mark Visser) — no governance, no risklog
- [ ] SLM (Lisa van den Berg) — no renewal access
- [ ] MGR (Sandra Kuijpers) — no aitools, full admin

---

## Known Fragile Areas

- **Renewal funnel approval gate logic** (`renderRenewal()` ~line 3793, `RENEWAL_DATA` ~line 1573) — the multi-role sign-off at T-6 (CM+MGR required) and T-3 (all four approvers) is complex. The `signoffs`, `vote`, and `contested` fields interact. Any change to the gate logic risks breaking the clear/block behaviour. Test every approval stage after touching this code.

- **`RBAC_MATRIX` / `ADMIN_VIEWS` sync** — these two structures must always be in sync. `RBAC_MATRIX` (~line 6162) controls live access; `ADMIN_VIEWS` (~line 6171) controls what the admin can configure. A view missing from `ADMIN_VIEWS` is invisible in the admin panel; a view missing from `RBAC_MATRIX` gives silent null access.

- **`loadFromStorage()` version check** (~line 7757) — the line `if(!data || data.version !== "6.0") return false` rejects any saved session that doesn't match exactly. Bumping the version number in `saveToStorage` without adding a migration will wipe all user data on next load.

- **`renderCurrentView()` switch** (~line 1979) — new views that aren't in this switch render nothing without any error. Easy to forget when adding a view.
