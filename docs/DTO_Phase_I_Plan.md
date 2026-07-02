# DTO Phase I Plan — Use Cases, Data & Synthetic-Data Plan, Success Criteria, ROI, MVP Roadmap

**Solicitation:** DLA26BZ03-NV011 — *Digital Twin of the Organization for Enhanced Mission Readiness*
**Offeror:** UltiSim Inc. · **Phase:** I (≤ 12 months, ≤ $100,000, TRL 3–6)
**Companion docs:** `docs/DTO_Solution_Design.md` (architecture) · POC in `standalone/`

This document is the RFP-facing Phase I plan. It maps directly to the RFP's three
Phase I requirements — (1) identify and rank high-impact use cases; (2) define the data
acquisition and synthetic-data generation plan and success criteria; (3) establish the ROI
case and MVP roadmap.

---

## 1. High-Impact Use-Case Ranking

### 1.1 Scoring rubric
Each candidate use case is scored 1–5 on four weighted dimensions:

| Dimension | Weight | 1 (low) → 5 (high) |
|---|---|---|
| **Mission value** | 0.35 | Marginal efficiency → direct readiness/overmatch impact |
| **Feasibility (TRL 3–6)** | 0.25 | Research-heavy → demonstrable within Phase I |
| **Data readiness** | 0.20 | Sparse/siloed → available & structured |
| **Transition potential** | 0.20 | Niche → broad reuse across DLA & dual-use |

**Score = Σ(weight × rating).** Ties broken by mission value.

### 1.2 Ranked candidates

| # | Use case | Mission | Feas. | Data | Trans. | **Score** |
|---|----------|:---:|:---:|:---:|:---:|:---:|
| 1 | **Surge deployment & backfill (human capital)** — test personnel moves to cover deployments without mission degradation | 5 | 5 | 4 | 4 | **4.55** |
| 2 | **Human-machine teaming / AI automation of manual work** — identify what to automate and the org shifts required | 5 | 4 | 3 | 5 | **4.35** |
| 3 | **Supply-chain disruption response** — reallocate workforce under logistics shocks (Monte Carlo) | 4 | 4 | 3 | 4 | **3.80** |
| 4 | **Order-to-cash / finance process throughput** — streamline high-volume transactional work | 3 | 4 | 4 | 4 | **3.55** |
| 5 | **Geopolitical / great-power-competition posture** — workforce positioning under PMESII/DIMEFIL stress | 4 | 3 | 2 | 4 | **3.35** |
| 6 | **Reskilling & skill-gap forecasting** — anticipate and close capability shortfalls | 4 | 3 | 3 | 3 | **3.30** |

**Phase I focus (top 3):** #1 Surge deployment, #2 Human-machine teaming, #3 Supply-chain
disruption — all three are already demonstrated in the POC and share the same agent + synthetic-data
substrate, maximizing Phase I coverage per dollar.

---

## 2. Data Acquisition & Synthetic-Data Plan

### 2.1 Source inventory (Tier 1 → SMARTR → twin)

| Source system (illustrative) | Owner | Key fields | Cadence | Sensitivity |
|---|---|---|---|---|
| Personnel / HR (e.g., DCPDS-class) | J1 | billet, skill/qual codes, tenure, status, location | daily | PII / CUI |
| Logistics & readiness feeds | J3/J4 | workload, backlog, throughput, node status | near-real-time | CUI |
| Procurement / contracting | J7/Acq | request volume, cycle time, exceptions | daily | CUI |
| Communications / reports (unstructured) | J6 | tasking, escalations, sentiment | continuous | CUI |

### 2.2 Acquisition approach
- **Phase I:** governed **read-only extracts** / representative samples under a DUA; where access
  is not yet approved, use **synthetic stand-ins** calibrated to published distributions. (The POC's
  ingestion panel demonstrates the connector pattern with simulated feeds.)
- **SMARTR pipeline:** Scrub (validate/cleanse) → Model (statistical + semantic) → Align (schema
  reconciliation) → Represent (org ontology) → Transform (real-time + history) → Render (dashboards).
- **Phase II:** replace samples with governed live connectors; add NLP over comms/reports.

### 2.3 Synthetic-data generation methodology
**Implemented in the POC** (`standalone/dto-dashboard.html`) and productionized in Phase II:

1. **Fit** marginal distributions + covariance of numeric attributes (tenure, skill, performance,
   workload) and empirical proportions of categoricals (directorate, skill family).
2. **Generate** via covariance-preserving sampling (Cholesky / Gaussian-copula) so **means, standard
   deviations, and correlations are preserved** while **all PII fields are dropped**.
3. **Validate** fidelity (distribution & correlation error) and **privacy** (no record re-identifiable;
   nearest-neighbor distance thresholds).
4. **Phase II hardening:** conditional categorical structure, **differential-privacy** guarantees
   (ε budget), and utility/disclosure-risk metrics.

### 2.4 Governance / compliance
- **CMMC L2 (Self):** PII/CUI stays inside the boundary; only synthetic, statistically-faithful data
  is shared or modeled downstream.
- **ITAR/EAR:** technical-data access controlled; FN participation disclosed per Announcement §3.5.

---

## 3. Measurable Success Criteria

| Category | Metric | Phase I target |
|---|---|---|
| **Synthetic fidelity** | Max abs. error in preserved correlations (real vs synthetic) | ≤ 0.05 |
| | Marginal mean error (per numeric attribute) | ≤ 3% |
| **Privacy** | PII fields in synthetic output | 0 |
| | Records re-identifiable (nearest-neighbor test) | 0 |
| **Model validity** | SME face-validity rating (1–5) on scenario realism | ≥ 4.0 |
| | Backtest error vs known historical outcome (where data exists) | ≤ 15% |
| **Decision utility** | Time to run & interpret a scenario (naïve user) | ≤ 5 min |
| | Leaders who agree tool improves decision confidence (survey) | ≥ 80% |
| **Performance** | Twin refresh / scenario projection latency | ≤ 2 s |
| **Productivity model** | Documented, SME-endorsed pathway combination reaching ≥ 10× | 1+ pathway |

---

## 4. ROI Business Case

### 4.1 Assumptions (illustrative; calibrated in Phase I)
- Modeled population: ~240 knowledge-workers in the pilot scope (scales to enterprise).
- Baseline manual/administrative load: ~55% of capacity.
- Automatable share of that manual work: ~50–60%.
- Fully-loaded labor rate: ~$95/hr (adjust to actual).

### 4.2 Benefit levers
1. **Recovered capacity from automation + process streamlining** — freeing manual hours for
   mission work (the dominant lever).
2. **Avoided mission degradation during surge** — backfill planned in advance vs. reactive gaps.
3. **Faster time-to-decision** — scenario testing in minutes vs. weeks of staff analysis.
4. **Reduced overload/attrition risk** — fatigue surfaced before it becomes turnover.

### 4.3 Illustrative calculation (pilot scope)
- 240 staff × ~2 hrs/day recoverable via automation+process at moderate adoption
  ≈ **~480 recovered hrs/day** ≈ ~60 FTE-equivalents.
- Annualized at $95/hr → **multi-$M/yr recovered capacity** in the pilot alone.
- Phase I cost ceiling $100K → **payback in weeks** on demonstrated pilot value; the model
  formalizes these numbers against real (de-identified) baselines.

> The POC's "Pathway to 10×" makes the productivity mechanism explicit: AI alone ≈ 2×; combining
> automation + process + teaming + reskilling reaches ≈ 10×. ROI is driven by *how far up that
> pathway* DLA chooses to invest.

### 4.4 Cost model (Phase I)
Labor (SMEs, ML/data engineering, UX), DUA/data handling, and validation — within the $100K ceiling;
no capital infrastructure (cloud-native, API-first).

---

## 5. MVP Roadmap

### 5.1 Phase I (months 1–12)
| Milestone | Months | Deliverable |
|---|---|---|
| M1 — Use-case lock & data DUA | 1–2 | Ranked register (this doc), signed data agreements |
| M2 — SMARTR ingest + synthetic-data engine | 3–5 | Working pipeline; fidelity/privacy report vs §3 |
| M3 — Agent model + scenario library | 5–8 | Surge / teaming / supply-chain scenarios validated |
| M4 — Decision UI + ROI model | 8–10 | Executive simulator; SME face-validity ≥ 4.0 |
| M5 — Phase I report & MVP roadmap | 11–12 | Findings, success-criteria results, Phase II plan |

### 5.2 TRL progression
Enter at TRL 3 (analytical/experimental proof-of-concept) → exit Phase I at **TRL 5–6**
(validated in a relevant environment against de-identified DLA data).

### 5.3 Phase II preview
Governed live connectors, NLP analytics, differential-privacy synthetic data, expanded scenario
libraries (Monte Carlo supply-chain, PMESII/DIMEFIL), networked multi-user, and MVP hardening
toward production transition.

---

## 6. DLA Component Alignment
Collaboration is highly desirable per the RFP; the model is organized around **J1 (Personnel)**,
**J3 (Operations)**, **J6 (Information)**, and **J7 (Readiness)**. Phase I engagement: J1 as data/
validation partner for the surge use case; J6 for ingestion/NLP; J3/J7 for readiness scenarios.
