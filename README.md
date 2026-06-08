# PVSP v2.0 — Contract & Vendor Lifecycle Management

A single-file contract and vendor management MVP built for Dutch government procurement teams (Rijksoverheid context).

## Quick start

Open `index.html` in any modern browser. No build step, no server required.

Login: all personas use password `demo123`

## Personas

| Persona | Role | Login |
|---------|------|-------|
| CM — Annet de Vries | Contract Manager | `demo123` |
| CE — Bas Hendriks | Contract Owner (Directie) | `demo123` |
| PO — Mark Visser | Product Owner | `demo123` |
| SLM — Lisa van den Berg | Service Level Manager | `demo123` |
| MGR — Sandra Kuijpers | Manager | `demo123` |

## Feature overview

### Portfolio management
- Vendor health scoring (VHS) with 6-dimension radar
- Contract lifecycle tracking with status, value, expiry
- Side-by-side vendor comparison
- Document log with classification (A/B/C), retention policy, IMB-1/PR-15 compliance

### Renewal funnel
- 4-stage funnel: T-12 → T-9 → T-6 → T-3
- Approval gates per stage (PO at T-9, CM+MGR at T-6, all four at T-3)
- Structured sign-off with vote (Approve / Conditional / Object) + mandatory note
- Contested flag when any approver objects
- Auto-notify next-stage approvers on gate clear
- Inline discussion thread with @mentions per renewal row

### Playbooks
- VHS Critical Recovery, Contract Renewal, Onboarding playbooks
- Step-by-step drawer with progress rail
- Per-step owner assignment with alert notifications
- Step comment threads with @mentions
- Step notes persisted across navigation
- "Schedule meeting" pre-fills meeting modal from step context

### Tasks & collaboration
- Kanban board (Open / In progress / Done)
- Task slideout with: snooze (+3d/+7d/+14d), escalate (overdue only), copy to clipboard
- Recurring tasks (monthly / quarterly / annual) with auto-spawn on completion
- Playbook progress strip for playbook-sourced tasks
- Renewal gate strip for renewal_funnel-sourced tasks
- Contextual CTA: Mark in progress / Mark done / Reopen
- Hand-off with alert notification to recipient

### Risk log
- Risk matrix with level (high/medium/low) and status
- Bulk actions: close selected, archive selected

### Meetings
- Meeting log with QBR, tactical, escalation types
- External attendee picker from CONTACTS
- Action items → tasks

### Documents
- Document log with type, vendor, contract, classification, retention
- Column-level filtering and sorting
- Retention expiry alerts

### Analytics & AI Tools
- QBR report generation (PDF)
- VHS score breakdown with AI-powered commentary
- Contract clause analyser
- Predictive renewal risk scoring

### Admin
- User management (CRUD) with RBAC matrix
- Audit log with search, action filter, user filter, CSV export
- Alert thresholds configuration
- Security webhook configuration
- Retention policy settings

## Architecture

Single HTML file (~700KB). All data in localStorage. jsPDF for PDF exports (CDN).

Storage key: `pvsp_v59_data`

## RBAC matrix

| View | CM | CE | PO | SLM | MGR |
|------|----|----|-----|-----|-----|
| Dashboard | rw | rw | rw | rw | rw |
| Vendors | rw | rw | ro | ro | rw |
| Contracts | rw | rw | ro | ro | rw |
| Renewal | rw | rw | ro | — | rw |
| Tasks | rw | ro | rw | rw | rw |
| Meetings | rw | ro | ro | rw | rw |
| Documents | rw | rw | ro | rw | rw |
| Risk log | rw | ro | ro | rw | rw |
| Analytics | ro | ro | ro | ro | rw |
| Admin | rw | — | — | — | rw |
