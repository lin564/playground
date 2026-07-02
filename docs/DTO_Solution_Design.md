# Digital Twin of the Organization (DTO) — Solution Design

**Solicitation:** DLA26BZ03-NV011 — *Digital Twin of the Organization for Enhanced Mission Readiness*
**Offeror:** UltiSim Inc.
**Phase:** I (Proof-of-Concept, TRL 3–6, ≤ 12 months, ≤ $100,000)
**CMMC:** Level 2 (Self) · **ITAR/EAR controlled**

> This document is the engineering design that backs the UltiSim Technical Volume.
> It traces every RFP requirement to an architectural element and to the working
> proof-of-concept in this repository. Two POC tracks exist:
> 1. **Microverse track** (`behaviors/default/dtoEngine.js` + `worlds/default.js`) — the original
>    interface-layer demo on the DoD Virtual World Framework (Croquet Microverse).
> 2. **Standalone offline track** (`standalone/`) — the current, recommended POC. Because the
>    hosted Croquet network was retired (July 2025), the interface layer was re-implemented on a
>    vendored **Three.js** build that runs locally with no backend or API key. See §10.

---

## 1. Problem & Objective

DLA needs to move beyond static org charts and spreadsheets to a **dynamic,
continuously-updated digital twin of its workforce** that lets leaders:

- Identify structural/process pathways to a **10x productivity increase** for great-power competition.
- Test **surge-deployment** personnel moves before committing, without mission degradation.
- Find the **root causes of manual work** and decide what AI should automate, and how the
  org structure must shift for human-machine teaming.
- Generate **synthetic data** to stress-test against supply-chain, geopolitical, and surge events.

The static-model gap is the core problem. The DTO closes it with a live, agent-based,
synthetic-data-capable model that any leader can drive in a shared environment.

---

## 2. Architecture (four tiers)

The design mirrors the four tiers in the Technical Volume. The POC implements a thin,
transparent slice of every tier so the concept runs end-to-end today.

The canonical POC is the **standalone offline build** (`standalone/`, see §10); the mapping below
references it. (The legacy Microverse build in `behaviors/default/dtoEngine.js` implemented the same
tiers on Croquet before that network was retired.)

| Tier | Production role | POC realization (`standalone/`) |
|------|-----------------|----------------------------------|
| **1 — Physical** | Ingests live DLA data: personnel, logistics, procurement, comms | `dto-dashboard.html` Data-Ingestion panel — four simulated feeds (personnel/logistics/procurement/comms) + SMARTR pipeline + validation rate. No real PII. |
| **2 — Digital** | Agent-based simulation; each workforce element is an adaptive agent; ML updates agents as patterns shift | `createEngine()` instantiates 240 agents across J1/J3/J6/J7 with skill, automatability, role, load, and fatigue feedback; rendered live in `dto-twin.html`. |
| **3 — Analytics** | NLP + predictive modeling extract org intelligence | `step()` derives the RFP's KPIs (productivity multiplier, readiness, surge coverage, automation, overload) + the structural 10× decomposition, emergent from agent state. |
| **4 — Interface** | Dashboards & scenario-planning on the DoD Virtual World Framework | `dto-dashboard.html` — a decision-simulator UI with the 3D twin embedded as the hero; local cross-window sync via `BroadcastChannel`/`postMessage`. |

```
            ┌─────────────────────── Croquet replicated model (shared truth) ───────────────────────┐
 live feeds │  Tier 1 Physical ─▶ Tier 2 Digital (agents) ─▶ Tier 3 Analytics (KPIs)                │
 (synthetic │        ▲ SMARTR pipeline (Scrub·Model·Align·Represent·Transform·Render)               │
  in POC)   │        └──────────────── continuous-learning refresh loop ──────────────┐             │
            └────────────────────────────────────────────────────────────────────────┼─────────────┘
                                                                                       ▼
                                              Tier 4 Interface — 3D scenario dashboard (per-user pawn)
                                              multi-user · deterministic · tap-to-run-scenario
```

**Why a virtual-world runtime for Tier 4.** Croquet replicates the *model*, not pixels:
the twin's state is computed once, deterministically, and every connected leader sees the
identical organization and identical scenario. That is exactly the "collaborative
exploration of scenarios and their decision impacts" the Technical Volume promises, and it
maps cleanly onto the production DoD Virtual World Framework target.

---

## 3. SMARTR Data Pipeline (Tier 1 → Tier 3)

The Technical Volume's **SMARTR** pipeline is the integration backbone:

1. **Scrub** — automated validation/cleansing flags inconsistencies and improves quality.
2. **Model** — statistical + semantic modeling extracts patterns into structured capability/constraint representations.
3. **Align** — cross-system reconciliation across differing schemas, update frequencies, and granularity.
4. **Represent** — data normalized into standardized organizational ontologies for cross-functional analysis.
5. **Transform** — real-time transformation keeps the twin current while preserving historical context.
6. **Render** — output to interactive dashboards and scenario interfaces (Tier 4).

In the POC, Scrub→Represent are abstracted by the stable agent distributions; Transform→Render
are live (the refresh loop + canvas dashboard).

---

## 4. Synthetic Data Generation (the differentiator)

Central to both the RFP and the Technical Volume. Two purposes:

- **Privacy:** produce datasets that preserve statistical properties (population
  distributions, skill correlations, performance patterns) while stripping PII, so
  workforce analysis never exposes individuals. (CMMC L2 / ITAR posture: PII never leaves
  the boundary; only synthetic, statistically-faithful data is modeled and shared.)
- **Stress-testing:** generate thousands of internally-consistent organizational scenarios
  incorporating personnel capabilities, resource constraints, and temporal dynamics
  (deployment cycles, career progression).

POC behavior: the engine increments a synthetic-record counter each refresh and drives all
KPIs exclusively from synthetic agents — demonstrating analysis with **zero real PII**.

---

## 5. Scenario Models → RFP Questions

The POC ships five scenarios, each tuned to an RFP question. Each is a vector over
`surge`, `disruption`, `geo`, and `aiAdoption`:

| Scenario | Answers RFP question |
|----------|----------------------|
| Baseline Steady-State | Reference point for all comparisons |
| Surge Deployment | *How ready is the workforce for a sudden surge? Can we backfill deployed staff without mission degradation?* |
| Supply-Chain Disruption | *Reacting rapidly to supply-chain disruptions* (Monte Carlo vulnerability framing) |
| Geopolitical Shift (GPC) | *Countering the scale of near-peer adversaries* (PMESII/DIMEFIL framing) |
| AI-Augmented Workforce | *Structural/process pathways to a 10x productivity increase; what AI must automate* |

### KPI formulas (transparent, tunable)

- **Productivity multiplier** = `laborLever × teamingLever`, dragged by disruption & surge.
  - `laborLever = totalManual / residualManual` — labor freed by automating manual work.
  - `teamingLever = 1 + 9·aiAdoption^1.4` — human-machine teaming efficiency, approaching 10x at deep adoption.
- **Mission readiness %** = weighted blend of skill base (45%), surge backfill coverage (35%),
  and disruption/geopolitical drag (20%), with small synthetic noise to stay "live."
- **Surge backfill coverage %** = deployable staff ÷ deployed gap.
- **Manual work automated %** = automated hours ÷ (automated + residual manual hours).

These are intentionally legible so DLA SMEs can challenge and recalibrate them during Phase I —
exactly the **SME face-validity review** the Technical Volume calls for.

---

## 6. Validation & Scalability

Per the Technical Volume:

- **Validation:** historical backtesting, statistical cross-validation on hold-out sets, and
  SME face-validity review; continuous monitoring alerts on prediction drift; version control
  gives full traceability of model/validation/config changes.
- **Scalability:** modular, cloud-native, **API-first** so it interoperates with existing DLA
  systems; open standards (DoD Virtual World Framework) reduce vendor lock-in and ease tech
  refresh; accommodates emerging LLMs and next-gen predictive analytics.

---

## 7. Phase I Plan (deliverables map to the RFP)

| RFP Phase I requirement | Activity | Artifact |
|-------------------------|----------|----------|
| 1. Identify & rank high-impact use cases | Workshops with DLA components; weight by mission value × feasibility | Ranked use-case register (surge deployment, order-to-cash, human-machine teaming) |
| 2. Data sources + acquisition & synthetic-data plan + success criteria | Source inventory; SMARTR design; synthetic-data methodology; measurable KPIs | Data Acquisition & Synthetic Data Plan; Success-Criteria matrix |
| 3. Business case (ROI) + MVP roadmap | ROI model on productivity/readiness gains; agile sprint roadmap | ROI model + MVP Product Roadmap (carries to Phase II) |
| POC (this repo) | Working four-tier twin with collaborative scenario dashboard | `behaviors/default/dtoEngine.js` + `worlds/default.js` |

**DLA collaboration (highly desirable):** align with **J1 (Personnel)**, **J6 (Information)**,
**J3 (Operations)**, **J7 (Readiness)** — reflected in the agent directorates.

### Illustrative ROI logic
At AI-Augmented settings the POC shows a multi-x productivity multiplier; even a conservative
2–3x on the fraction of work that is automatable manual labor yields large recovered-capacity
hours/day. Phase I quantifies this against real (de-identified) DLA workload baselines and
expresses it as recovered FTE-equivalents and reduced time-to-decision.

---

## 8. Compliance Notes

- **CMMC L2 (Self):** synthetic-only modeling keeps CUI/PII inside the boundary; the shared
  twin replicates synthetic state, not source records.
- **ITAR (22 CFR 120–130) / EAR (15 CFR 730–774):** technical data access controlled; any
  foreign-national participation disclosed per Announcement §3.5 before performance.
- **TRL/MRL 3–6:** the POC demonstrates feasibility of an integrated, synthetic-data-driven,
  collaborative organizational twin without claiming an operational system.

---

## 9. Running the POC

**Canonical (standalone, offline — recommended):** open `standalone/dto-dashboard.html` in a
browser (double-click), or serve the folder for guaranteed cross-frame sync:

```bash
cd standalone && python3 -m http.server 8000   # then open http://localhost:8000/dto-dashboard.html
```

No install, no API key, no network. Set up a decision in the console, preview the projected impact,
then **Run This Decision** to commit it to the embedded 3D twin. See §10 for the file map.

**Legacy Microverse build (Croquet network retired July 2025 — no longer connects):**
`npm install && npm start` served `behaviors/default/dtoEngine.js` + `worlds/default.js` on port 9684.

---

## 10. Standalone offline POC (`standalone/`)

The recommended demonstration. No server, no API key, no internet — vendored Three.js only.

| File | What it is |
|------|------------|
| `standalone/dto-dashboard.html` | **Headline build.** A HealthSimAI-style *Workforce Decision Simulator* with the live 3D twin embedded as the hero, a data-ingestion panel, a decision console, and a synthetic-data generator. |
| `standalone/dto-twin.html` | The agent-based 3D world (240 agents across J1/J3/J6/J7). Runs standalone or embedded (`?embed=1`) and accepts `postMessage` lever/scenario commands. |
| `standalone/dto.html` | Lightweight 2D dashboard (no 3D dependency). |
| `standalone/vendor/three.min.js` | Vendored Three.js r149 (UMD) so the world runs from `file://`. |

**Run:** open `dto-dashboard.html` (double-click), or `python3 -m http.server` in `standalone/`
for guaranteed cross-frame sync, then open `http://localhost:8000/dto-dashboard.html`.

### 10.1 Positioning the tool — a workforce decision "flight simulator"

The interface is framed around the core value proposition: **test an organizational decision
before committing to it.** Simulation-mode framing (safe sandbox), a 3-step loop
(*set up a decision → preview the impact → run it on the twin*), an explicit **LIVE vs.
PROJECTED** split, and a plain-English **verdict** (Recommended / Proceed with caution /
High risk) make the function legible to non-technical leaders.

### 10.2 Data ingestion (Tier 1)

A **Data Ingestion** panel shows four operational feeds — Personnel/HR, Logistics, Procurement,
Communications — streaming records into the twin with per-feed throughput, a validation rate, and
the **SMARTR** pipeline strip (Scrub · Model · Align · Represent · Transform · Render). In the POC
these are **simulated connectors**; Phase II replaces them with governed live connectors to DLA
systems of record.

### 10.3 Synthetic data generation (real method)

The synthetic-data capability is implemented, not mocked:

1. A sensitive **"real" HR table** is generated with PII fields (name, SSN, DOB) plus correlated
   numeric attributes (tenure, skill, performance) and a categorical directorate.
2. A **PII-free synthetic dataset** is produced by estimating the mean vector and covariance of
   the numeric attributes and sampling via **Cholesky decomposition** (a Gaussian-copula-style
   method), with categorical fields drawn from the empirical proportions. **No PII fields are
   emitted.**
3. A **before/after panel** shows that means, standard deviations, and key correlations
   (skill↔performance, tenure↔skill) are preserved, alongside a skill-distribution histogram and a
   privacy attestation (PII fields retained = 0; no synthetic record copies a real person).

This lets workforce analysis proceed on statistically faithful data without exposing individuals —
directly supporting the CMMC L2 / PII-protection posture.

### 10.4 Structural pathways to 10× productivity

Productivity is modeled as a **decomposition of four structural levers**, not a single AI dial:

```
work_capacity = f_automation × f_process × f_teaming × f_reskill × overload_drag
```

- **Automation (AI)** — `1 / (1 − AI-absorbed share)`
- **Process streamlining** — eliminating low-value manual work
- **Human-machine teaming & reorg** — coordination/throughput gains
- **Reskilling** — higher output per person

The **Pathway-to-10×** view shows each lever's multiplier and the combined result against the 10×
target. A key, deliberately honest result: **AI alone reaches ≈2×; ≈10× requires all four levers
pulled together** — i.e., 10× is a *structural transformation*, not an automation purchase.

---

## 11. Methodology & honest limitations

To keep the proposal credible, the POC distinguishes what is *demonstrated* from what is *planned*:

| Area | Status in POC | Production (Phase II+) |
|------|---------------|------------------------|
| Live data ingestion | **Simulated feeds** (clearly labeled) | Governed connectors to DLA systems of record |
| Synthetic data | **Real method** (covariance-preserving, PII-stripped), demonstration scale | + categorical conditional structure, differential-privacy guarantees, utility/disclosure metrics |
| 10× productivity model | **Illustrative** lever decomposition | Calibrated to real workload baselines; SME-validated |
| Agent model | Deterministic ABM with fatigue feedback | ML-updated agents from historical performance |
| Validation | Face-valid, internally consistent | Historical backtesting + statistical cross-validation + SME review |
| Multi-user | Local cross-window sync (`BroadcastChannel`/`postMessage`) | Networked collaboration via a sync backend |

All figures are illustrative model outputs for a TRL 3–6 feasibility demonstration, **not validated
against live DLA data**. Calibration, validation, and governed data integration are explicit
Phase I/II deliverables.

---

## 12. Phase II / Phase III Outlook

- **Phase II:** milestone-driven agile sprints to a validated MVP — replace the synthetic feed
  with governed live connectors, harden the SMARTR pipeline, add NLP analytics over real
  comms/reports, expand scenario libraries (Monte Carlo supply-chain, PMESII/DIMEFIL), and
  refine the ROI/business case on demonstrated mission value.
- **Phase III (dual-use):** transition to production for DoW orders; adapt the same engine for
  corporate strategic planning, enterprise HR, and organizational design for non-DoW agencies
  navigating the AI transition.
