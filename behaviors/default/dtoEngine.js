// Digital Twin of the Organization (DTO) — Phase I Proof-of-Concept
// DLA26BZ03-NV011 | UltiSim Inc.
//
// This behavior realizes the *interface layer* described in the UltiSim
// Technical Volume on the DoD Virtual World Framework (here, Croquet
// Microverse): a collaborative 3D scenario-planning dashboard backed by a
// replicated simulation engine.
//
// It implements a thin, transparent version of all four tiers from the
// Technical Volume so the concept can be demonstrated end-to-end:
//
//   1. Physical layer   -> synthetic data feed (no real PII is used)
//   2. Digital layer    -> agent-based workforce model (each element an agent)
//   3. Analytics layer  -> KPI computation tied to the RFP objectives
//   4. Interface layer  -> the 3D dashboard pawn (collaborative, multi-user)
//
// Everything in DTOEngineActor runs inside the replicated Croquet model, so
// all connected leaders see the identical twin and the identical scenario.
// Determinism is preserved with a seeded PRNG instead of Math.random.

class DTOEngineActor {
    setup() {
        // ---- deterministic PRNG (LCG) so the twin replicates bit-for-bit ----
        this._seed = 0x2545f491;

        // ---- scenario library (maps directly to the RFP's key questions) ----
        // surge:       fraction of the workforce suddenly deployed/unavailable
        // disruption:  supply-chain / logistics stress [0..1]
        // geo:         geopolitical pressure (great-power competition) [0..1]
        // aiAdoption:  share of automatable work actually handed to AI [0..1]
        this.scenarios = [
            { name: "Baseline Steady-State",      surge: 0.00, disruption: 0.05, geo: 0.10, aiAdoption: 0.20 },
            { name: "Surge Deployment",           surge: 0.35, disruption: 0.15, geo: 0.30, aiAdoption: 0.25 },
            { name: "Supply-Chain Disruption",    surge: 0.10, disruption: 0.60, geo: 0.40, aiAdoption: 0.30 },
            { name: "Geopolitical Shift (GPC)",   surge: 0.25, disruption: 0.45, geo: 0.75, aiAdoption: 0.35 },
            { name: "AI-Augmented Workforce",     surge: 0.10, disruption: 0.20, geo: 0.30, aiAdoption: 0.85 },
        ];
        this.scenarioIndex = 0;
        this.tick = 0;
        this.syntheticRecords = 0;

        this.buildWorkforce();      // digital layer
        this.computeState();        // first analytics pass

        // leaders interact through the dashboard pawn
        this.listen("cycleScenario", "cycleScenario");
        this.listen("setScenario", "setScenario");
        this.listen("requestState", "publishState");

        // continuous-learning loop: the twin refreshes on a fixed cadence
        this.future(1500).step();
    }

    // [0,1) deterministic random — safe inside the replicated model
    rand() {
        this._seed = (Math.imul(this._seed, 1664525) + 1013904223) >>> 0;
        return this._seed / 4294967296;
    }

    // ---- Digital layer: represent each workforce element as an agent ----
    // DLA J-codes are used as illustrative directorates (RFP: J1/J6/J3/J7).
    buildWorkforce() {
        const directorates = ["J1 Personnel", "J3 Operations", "J6 Information", "J7 Readiness"];
        const POP = 240;
        this.agents = [];
        for (let i = 0; i < POP; i++) {
            const dir = directorates[i % directorates.length];
            // skill, manual workload, and how automatable that work is — each
            // drawn from a stable distribution so the cohort is realistic.
            this.agents.push({
                dir,
                skill: 0.45 + this.rand() * 0.5,        // 0.45..0.95
                manualLoad: 4 + this.rand() * 6,        // hours/day of manual work
                automatable: 0.3 + this.rand() * 0.6,   // fraction AI can absorb
                deployable: this.rand() > 0.25,         // can backfill a surge
            });
        }
        this.directorates = directorates;
        this.population = POP;
    }

    cycleScenario() {
        this.scenarioIndex = (this.scenarioIndex + 1) % this.scenarios.length;
        this.computeState();
        this.publishState();
    }

    setScenario(index) {
        if (typeof index === "number" && index >= 0 && index < this.scenarios.length) {
            this.scenarioIndex = index;
            this.computeState();
            this.publishState();
        }
    }

    // continuous refresh — generates a fresh synthetic snapshot each cadence
    step() {
        this.tick += 1;
        // Physical layer (simulated): every cadence the SMARTR pipeline would
        // ingest and synthesize a new batch of de-identified records.
        this.syntheticRecords += 2500 + Math.floor(this.rand() * 500);
        this.computeState();
        this.publishState();
        this.future(1500).step();
    }

    // ---- Analytics layer: turn the agent population + scenario into KPIs ----
    computeState() {
        const s = this.scenarios[this.scenarioIndex];

        let totalManual = 0;      // baseline manual hours across the org
        let residualManual = 0;   // manual hours left AFTER AI automation
        let deployableCount = 0;
        let skillSum = 0;

        for (const a of this.agents) {
            totalManual += a.manualLoad;
            // AI absorbs aiAdoption * automatable share of this agent's manual work
            const absorbed = a.manualLoad * a.automatable * s.aiAdoption;
            residualManual += a.manualLoad - absorbed;
            skillSum += a.skill;
            if (a.deployable) deployableCount += 1;
        }

        const automatedHours = totalManual - residualManual;

        // Productivity multiplier toward the RFP's 10x target. Two compounding
        // levers: (1) labor freed by automating manual work, (2) human-machine
        // teaming efficiency. Tuned so deep AI adoption approaches ~10x.
        const laborLever = totalManual / Math.max(residualManual, 1);   // >= 1
        const teamingLever = 1 + 9 * Math.pow(s.aiAdoption, 1.4);        // 1..10
        let productivity = laborLever * teamingLever;
        // disruption and surge drag on realized productivity
        productivity *= (1 - 0.25 * s.disruption) * (1 - 0.20 * s.surge);
        productivity = Math.max(1, productivity);

        // Surge backfill coverage: can deployable staff cover the deployed gap?
        const deployedGap = Math.round(this.population * s.surge);
        const backfillCapacity = deployableCount;
        const surgeCoverage = deployedGap === 0
            ? 100
            : Math.min(100, (backfillCapacity / deployedGap) * 100);

        // Mission readiness: blends skill base, backfill coverage, and the
        // drag from disruption + geopolitical pressure. Small synthetic noise
        // keeps the gauge "live" between scenario changes.
        const skillBase = (skillSum / this.population) * 100;
        const noise = (this.rand() - 0.5) * 2; // +/- 1 point
        let readiness =
            0.45 * skillBase +
            0.35 * surgeCoverage +
            0.20 * (100 - (s.disruption * 60 + s.geo * 40)) +
            noise;
        readiness = Math.max(0, Math.min(100, readiness));

        this.state = {
            scenarioIndex: this.scenarioIndex,
            scenarioName: s.name,
            tick: this.tick,
            population: this.population,
            syntheticRecords: this.syntheticRecords,
            productivity,                                    // x
            readiness,                                       // %
            surgeCoverage,                                   // %
            manualHoursPerDay: Math.round(residualManual),   // residual manual
            automatedHoursPerDay: Math.round(automatedHours),
            aiAdoption: s.aiAdoption,
            disruption: s.disruption,
            geo: s.geo,
            surge: s.surge,
        };
    }

    publishState() {
        this.say("dtoState", this.state);
    }
}

class DTODashboardPawn {
    setup() {
        const THREE = Microverse.THREE;
        const cd = this.actor._cardData;
        this.boardWidth = cd.width || 4.2;
        this.boardHeight = cd.height || 2.6;

        // a single canvas-textured plane is the dashboard surface
        this.canvas = document.createElement("canvas");
        this.canvas.width = 1024;
        this.canvas.height = 640;
        this.ctx = this.canvas.getContext("2d");

        this.texture = new THREE.CanvasTexture(this.canvas);
        this.texture.colorSpace = THREE.SRGBColorSpace;

        const geo = new THREE.PlaneGeometry(this.boardWidth, this.boardHeight);
        const mat = new THREE.MeshBasicMaterial({
            map: this.texture,
            side: THREE.DoubleSide,
            toneMapped: false,
        });
        this.board = new THREE.Mesh(geo, mat);
        this.board.name = "dtoBoard";
        this.shape.add(this.board);

        // tap anywhere on the board to advance to the next scenario
        this.addEventListener("pointerTap", "onTap");

        this.listen("dtoState", "updateState");
        this.draw(null);
        this.say("requestState");
    }

    onTap() {
        this.say("cycleScenario");
    }

    updateState(state) {
        this.state = state;
        this.draw(state);
    }

    // ---- helpers -------------------------------------------------------
    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    kpiCard(ctx, x, y, w, h, label, value, sub, fillPct, color) {
        ctx.fillStyle = "#14223b";
        this.roundRect(ctx, x, y, w, h, 14);
        ctx.fill();

        ctx.fillStyle = "#7f93b5";
        ctx.font = "20px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(label, x + 22, y + 38);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 52px sans-serif";
        ctx.fillText(value, x + 22, y + 96);

        if (sub) {
            ctx.fillStyle = "#9fb3d6";
            ctx.font = "18px sans-serif";
            ctx.fillText(sub, x + 22, y + 126);
        }

        // progress bar
        const barX = x + 22, barY = y + h - 28, barW = w - 44, barH = 12;
        ctx.fillStyle = "#0a1426";
        this.roundRect(ctx, barX, barY, barW, barH, 6);
        ctx.fill();
        ctx.fillStyle = color;
        const pct = Math.max(0, Math.min(1, fillPct));
        this.roundRect(ctx, barX, barY, Math.max(barH, barW * pct), barH, 6);
        ctx.fill();
    }

    draw(state) {
        const ctx = this.ctx;
        const W = this.canvas.width, H = this.canvas.height;

        // background
        ctx.fillStyle = "#0a1426";
        ctx.fillRect(0, 0, W, H);

        // header
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 34px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Digital Twin of the Organization", 36, 50);
        ctx.fillStyle = "#5fa8ff";
        ctx.font = "20px sans-serif";
        ctx.fillText("DLA26BZ03-NV011  ·  UltiSim Inc.  ·  Phase I POC", 36, 80);

        if (!state) {
            ctx.fillStyle = "#7f93b5";
            ctx.font = "22px sans-serif";
            ctx.fillText("Initializing organizational twin…", 36, 140);
            this.texture.needsUpdate = true;
            return;
        }

        // active scenario banner
        ctx.fillStyle = "#13294b";
        this.roundRect(ctx, 36, 100, W - 72, 56, 12);
        ctx.fill();
        ctx.fillStyle = "#9fb3d6";
        ctx.font = "18px sans-serif";
        ctx.fillText("ACTIVE SCENARIO", 56, 124);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px sans-serif";
        ctx.fillText(state.scenarioName, 56, 150);
        ctx.fillStyle = "#5fa8ff";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`scenario ${state.scenarioIndex + 1}/5`, W - 56, 150);
        ctx.textAlign = "left";

        // KPI grid (2 x 2)
        const gx = 36, gy = 176, gw = (W - 72 - 24) / 2, gh = 150, gap = 24;

        const prod = state.productivity;
        this.kpiCard(ctx, gx, gy, gw, gh,
            "PRODUCTIVITY MULTIPLIER", `${prod.toFixed(1)}x`,
            "target 10x  ·  great-power overmatch",
            prod / 10, prod >= 7 ? "#36d399" : prod >= 3 ? "#fbbd23" : "#f87272");

        this.kpiCard(ctx, gx + gw + gap, gy, gw, gh,
            "MISSION READINESS", `${state.readiness.toFixed(0)}%`,
            "skill · backfill · disruption blend",
            state.readiness / 100, state.readiness >= 75 ? "#36d399" : state.readiness >= 50 ? "#fbbd23" : "#f87272");

        this.kpiCard(ctx, gx, gy + gh + gap, gw, gh,
            "SURGE BACKFILL COVERAGE", `${state.surgeCoverage.toFixed(0)}%`,
            "deployable staff vs. deployed gap",
            state.surgeCoverage / 100, state.surgeCoverage >= 90 ? "#36d399" : state.surgeCoverage >= 60 ? "#fbbd23" : "#f87272");

        const autoShare = state.automatedHoursPerDay /
            Math.max(1, state.automatedHoursPerDay + state.manualHoursPerDay);
        this.kpiCard(ctx, gx + gw + gap, gy + gh + gap, gw, gh,
            "MANUAL WORK AUTOMATED", `${(autoShare * 100).toFixed(0)}%`,
            `${state.automatedHoursPerDay} hrs/day shifted to AI`,
            autoShare, "#5fa8ff");

        // footer telemetry
        ctx.fillStyle = "#7f93b5";
        ctx.font = "17px sans-serif";
        ctx.fillText(
            `${state.population} workforce agents · ${state.syntheticRecords.toLocaleString()} synthetic records (PII-free) · refresh #${state.tick}`,
            36, H - 26);
        ctx.textAlign = "right";
        ctx.fillStyle = "#5fa8ff";
        ctx.fillText("▶ tap board to run next scenario", W - 36, H - 26);
        ctx.textAlign = "left";

        this.texture.needsUpdate = true;
    }

    teardown() {
        if (this.board) {
            this.shape.remove(this.board);
            this.board.geometry?.dispose();
            this.board.material?.dispose();
        }
        this.texture?.dispose();
    }
}

export default {
    modules: [
        {
            name: "DTO",
            actorBehaviors: [DTOEngineActor],
            pawnBehaviors: [DTODashboardPawn],
        },
    ],
};

/* globals Microverse */
