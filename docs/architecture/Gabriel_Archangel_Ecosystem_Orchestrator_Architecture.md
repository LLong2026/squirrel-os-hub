# Gabriel: Archangel-Class Ecosystem Orchestration in Self-Healing Settlement Operating Systems

**A Formal Architecture Description**

---

**Author:** Leon Calvin Long II
**Affiliation:** Squirrel OS Technologies
**Date:** August 2026
**DOI:** 10.5281/zenodo.21450025 (ecosystem)
**Patent References:** 64/114,746, 64/119,191, 19/693,343
**License:** CC BY 4.0

---

## Abstract

Gabriel is an archangel-class AI agent operating as the central ecosystem orchestrator within the Squirrel OS infrastructure. Unlike traditional orchestrators that manage computational resources, Gabriel governs the deployment, monitoring, healing dispatch, and commercial lifecycle of self-healing infrastructure across heterogeneous application ecosystems. This paper formally describes Gabriel's architecture across six domains: (1) the hub-and-spoke communication topology, (2) platform governance and tier enforcement, (3) cross-app health monitoring with deterministic escalation, (4) multi-chain RPC routing for settlement infrastructure, (5) post-quantum cryptographic compliance, and (6) credit integrity and commercial lifecycle management. We present the entity model, backend function inventory, operating rules, and formal invariants that constrain Gabriel's autonomous behavior, demonstrating that a single hub-level agent can safely govern dozens of customer app ecosystems without cross-tenant data leakage or unbounded autonomous action.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Context: The Four Minds](#2-system-context-the-four-minds)
3. [Hub-and-Spoke Topology](#3-hub-and-spoke-topology)
4. [Entity Model](#4-entity-model)
5. [Backend Function Inventory](#5-backend-function-inventory)
6. [Platform Governance](#6-platform-governance)
7. [Cross-App Health Monitoring](#7-cross-app-health-monitoring)
8. [Alert Escalation Protocol](#8-alert-escalation-protocol)
9. [Multi-Chain RPC Routing](#9-multi-chain-rpc-routing)
10. [Post-Quantum Cryptographic Compliance](#10-post-quantum-cryptographic-compliance)
11. [Credit Integrity and Commercial Lifecycle](#11-credit-integrity-and-commercial-lifecycle)
12. [Tenant Isolation](#12-tenant-isolation)
13. [AI Safety Properties](#13-ai-safety-properties)
14. [Formal Invariants](#14-formal-invariants)
15. [Reference Deployment](#15-reference-deployment)
16. [Conclusion](#16-conclusion)

---

## 1. Introduction

Squirrel OS is a patent-pending operating system layer that deploys autonomous self-healing, anomaly detection, and post-quantum cryptographic compliance across fintech application ecosystems. Within this architecture, four archangel-class AI agents operate in a bifurcated governance model:

- **Jasper** — the Hypervisor, a deterministic validation layer that governs all probabilistic outputs against invariant contracts
- **Amelia** — the Aegis healing brain, executing playbook-driven anomaly resolution
- **Gillian** — the autonomous integration orchestrator, managing a 50K-node layered neural mesh
- **Gabriel** — the ecosystem orchestrator and commercial hub

Gabriel is unique among the four: it is the only agent that operates at the **platform level** rather than the application level. While Jasper supervises computation, Amelia heals anomalies, and Gillian integrates systems, Gabriel **deploys, monitors, governs, and commercializes** the entire Squirrel OS ecosystem. It is the single point through which customers are onboarded, apps are registered, health is monitored, alerts are escalated, and credits are tracked.

This paper provides the formal architecture description of Gabriel's role, constraints, and operational model.

---

## 2. System Context: The Four Minds

```
                    ┌─────────────────────────────────┐
                    │       JASPER HYPERVISOR         │
                    │  Deterministic Validation Layer │
                    │  (Operator Algebra, Invariants) │
                    └───────────────┬─────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
           ┌────────┴──────┐ ┌─────┴──────┐ ┌───────┴──────┐
           │   AMELIA      │ │  GABRIEL   │ │   GILLIAN    │
           │   Aegis       │ │  Ecosystem │ │   Integration│
           │   Healing     │ │  Orchestr. │ │   Mesh       │
           │   Brain       │ │  (HUB)     │ │   Orchestr.  │
           │   400 manuals│ │  12 entities│ │  50K nodes  │
           │   50K mesh   │ │  8 skills   │ │  PQC secured │
           └───────────────┘ └────────────┘ └──────────────┘
```

Gabriel occupies the **hub position** in the ecosystem. Every spoke (customer app, healing event, health scan, credit transaction) routes through Gabriel. This centralization is not a bottleneck — it is a **governance boundary**. By forcing all operational and commercial flows through a single auditable agent, Squirrel OS achieves:

1. **Unified escalation** — critical alerts never bypass human review
2. **Tenant isolation** — cross-customer data leakage is architecturally impossible
3. **Credit integrity** — no speculative billing, no untracked resource consumption
4. **Deployment authorization** — no Squirrel OS instance deploys without explicit approval

---

## 3. Hub-and-Spoke Topology

### 3.1 Architecture

Gabriel implements a hub-and-spoke communication model:

| Property | Specification |
|----------|--------------|
| **Hub** | Gabriel Superagent (Base44 app `69b57683f2623117603736bc`) |
| **Spokes** | Each customer app with Squirrel OS deployed |
| **Communication** | Backend function calls + entity reads + alert escalation |
| **Sidebar Integration** | Each spoke app links to Gabriel via sidebar navigation |
| **Alert Channel** | Gabriel superagent chat (not Slack, not email) |

### 3.2 Connected Agents

| Agent | Role | Domain |
|-------|------|--------|
| Amelia | Self-healing brain | Anomaly detection, playbook execution |
| Gillian | Integration orchestrator | Neural mesh, PQC validation |
| Jasper | Hypervisor supervisor | Deterministic governance, invariant validation |
| Aegis | Infrastructure guardian | Quantum decoherence detection |
| Aegis Sentinel | Quantum threat sentinel | PQC monitoring |
| ARETE | Recursive learning orchestrator | Mesh optimization, pattern learning |

### 3.3 Communication Protocol

Each spoke app's sidebar includes a Gabriel entry with:
- Status indicator (online + health score)
- Action button linking to the Gabriel superagent chat
- Description: "Cross-app coordination, healing dispatch, and system alerts"

This means any operator on any app can reach the central orchestrator with a single click — no API keys, no Slack channels, no email chains.

---

## 4. Entity Model

Gabriel hosts 27 entity schemas organized into three tiers:

### 4.1 Squirrel OS Core Entities (15)

Deployed into every customer app:

| Entity | Purpose |
|--------|---------|
| AegisAnomaly | Detected anomalies with severity, confidence, PQC classification |
| AegisPlaybook | Immutable repair playbooks with isolation/healing/verification steps |
| AegisHealingEvent | Audit trail for every healing action |
| SystemHealth | Aggregate system health snapshot |
| SystemHeartbeat | Per-node heartbeat records (latency, CPU, memory, tokens) |
| OrchestratorAgent | AI agent registry with health scores and task capacity |
| OrchestratorNode | Compute node registry with orphan detection |
| OrchestratorTask | Task queue with priority and token tracking |
| Pattern | Learned anomaly patterns with auto-heal flags |
| Insight | Derived insights from pattern analysis |
| NeuralNode | Neural mesh topology (layer, weight, connections) |
| LearningMetric | Trendable metrics for self-improvement loop |
| PredictiveAlert | Proactive alerts with probability and recommended action |
| SelfImprovementProposal | Proposed changes (must be approved before deployment) |
| RemediationSweep | Sweep audit records |

### 4.2 Platform Entities (12)

Hosted exclusively on Gabriel:

| Entity | Purpose |
|--------|---------|
| Customer | Customer accounts with tier, billing, credit tracking |
| ConnectedApp | Registered customer apps with health and deployment status |
| DeploymentJob | Deployment tracking (pending_approval → in_progress → completed/failed) |
| HealthManifest | Per-app health snapshots aggregated from cross-app scans |
| HealingEventLog | Cross-customer healing event audit log (redacted) |
| CreditUsage | Per-customer credit ledger against tier allotment |
| PlatformAlert | Alerts with severity escalation to Gabriel |
| TierConfiguration | Feature mapping per tier (free/licensed/saas) |
| PlaybookTemplate | 11 AegisPlaybook definitions (immutable reference) |
| SkillTemplate | 4 operational skill definitions |
| NeuralNodeTemplate | 31 neural mesh nodes across 5 layers (immutable reference) |
| NeuralMeshSnapshot | Per-app mesh topology snapshots |

### 4.3 Governance Entities (3)

| Entity | Purpose |
|--------|---------|
| CompliancePolicy | Compliance standard mapping with enforcement level |
| MetaMonitor | 8 health metrics tracking Gabriel's own integrity |
| CircuitBreaker | Per-app, per-adapter, and global rate limiting |
| RateLimitLog | Action rate tracking with window enforcement |

---

## 5. Backend Function Inventory

Gabriel hosts 14 backend functions across three categories:

### 5.1 Platform Operations (5)

| Function | Purpose |
|----------|---------|
| `scanConnectedApps` | Cross-app health scanner — reads health from all connected apps |
| `jasperCrossAppMonitor` | Jasper hypervisor cross-app supervision |
| `squirrelOsRemediation` | Remediation execution dispatcher |
| `jasperRemediation` | Jasper-level remediation with invariant validation |
| `multiChainRpc` | Multi-chain JSON-RPC router (5 chains) |

### 5.2 Safety & Compliance (3)

| Function | Purpose |
|----------|---------|
| `circuitBreakerEnforcer` | Circuit breaker state machine enforcement |
| `eventSigner` | Cryptographic event signing for audit trail integrity |
| `metaMonitor` | 8-metric self-monitoring of Gabriel's own health |

### 5.3 Platform Adapters (4)

| Function | Purpose |
|----------|---------|
| `microsoftAdapter` | Azure/M365/Entra integration |
| `iosAdapter` | App Store/APNs integration |
| `windowsAdapter` | Intune/Defender integration |
| `macosAdapter` | Jamf/Keychain integration |

### 5.4 Commercial (2)

| Function | Purpose |
|----------|---------|
| `getMasterPlaybookLibrary` | Returns the 11-playbook reference library |
| `getSquirrelOSInstaller` | Returns the deployment package for a target app |
| `createCheckoutSession` | Stripe checkout session creation |

---

## 6. Platform Governance

### 6.1 Tier Enforcement

Gabriel enforces a three-tier commercial model:

| Tier | Price | Entity Set | Features |
|------|-------|-----------|----------|
| **Free** | $0 | 15 core entities | 11 playbooks, heartbeat monitoring, anomaly detection, audit trail |
| **Licensed** | $25,000 one-time² | 15 core + platform adapters | Full neural mesh, PQC adaptation, cross-app monitor, all 4 skills, 3 workflows, pattern learning |
| **SaaS** | $2,500/month | Full stack | Hosted hub, daily reports, critical escalation, credit tracking, template updates, kill switch, meta-monitoring |

**Enforcement Rule:** Gabriel always verifies a customer's `TierConfiguration` before granting licensed or SaaS features. Any request for higher-tier features from a free customer routes to an upgrade flow. No feature is silently granted above the customer's tier.

### 6.2 Deployment Authorization

Squirrel OS deployments are gated on a `DeploymentJob` record:

```
pending_approval → in_progress → completed
                                → failed
```

**Rule:** Gabriel never deploys Squirrel OS to a customer app without explicit authorization from that customer's admin or from Leon. No deployment proceeds without an approved `DeploymentJob`.

### 6.3 Template Integrity

The following are patent-protected immutable templates:
- 15-entity reference schema
- 11 playbook definitions
- 4 skill definitions
- 31 neural node topology

**Rule:** Gabriel never modifies these templates during deployment. Customer-specific customization of core templates is refused.

---

## 7. Cross-App Health Monitoring

### 7.1 Heartbeat Scanning

Gabriel executes cross-app health scans via the `scanConnectedApps` backend function. For each connected app, Gabriel:

1. Reads `SystemHealth` and `SystemHeartbeat` records
2. Compares metrics against tier thresholds
3. Creates a `HealthManifest` snapshot
4. Escalates if health drops below tier threshold for 2 consecutive scans

### 7.2 Health Manifest Output

Each scan produces a System Health Manifest:

```
### Core System Pulse
- Status: [OPERATIONAL / DEGRADED / CRITICAL FAILURE]
- Active Anomalies: [None / Detail]
- Pipeline Health: [Stable / Latency / Broken]

### Microservice & Agent Breakdown
- Agent Sub-Grid: [Status & Score]
- Micro/Subservice Mesh: [Status & Score]
- Continuous Learning Loop: [Status & Score]

### Automated Remediation
- [Exact interventions required]

### Log Summary
- [2-line technical post-mortem]
```

### 7.3 Daily Sweep

Gabriel runs a daily full-ecosystem sweep:
1. Scan all connected apps for anomalies
2. Aggregate healing events into `HealingEventLog`
3. Compute credit usage per customer
4. Generate `RemediationSweep` audit record
5. Update `Pattern` and `LearningMetric` entities

---

## 8. Alert Escalation Protocol

### 8.1 Escalation Channel

Gabriel superagent chat is the **sole escalation channel** — not Slack, not email, not any third-party messaging system.

### 8.2 Critical Alert Rules

1. Gabriel **never** auto-resolves a `PlatformAlert` marked severity `critical`
2. Gabriel **always** escalates critical alerts to Leon via the superagent chat
3. Gabriel waits for human acknowledgment before resolving critical alerts

### 8.3 Health Drop Escalation

If a connected app's `health_score` drops below the tier threshold for 2 consecutive heartbeat scans:
1. Create a critical `PlatformAlert` immediately
2. Set `escalated_to_gabriel = true`
3. Notify Leon — do not wait for the daily sweep

### 8.4 Fintech-Specific Escalation

Gabriel escalates to a human operator immediately when:
- A healing attempt fails twice on the same anomaly
- A critical-severity anomaly has no matching playbook
- The `pqcManager` detects a cryptographic validation failure
- `SystemHealth` status degrades to `critical` for more than 3 consecutive heartbeat cycles

---

## 9. Multi-Chain RPC Routing

### 9.1 Architecture

Gabriel hosts a `multiChainRpc` backend function that routes JSON-RPC calls to five blockchain networks:

| Chain | Default Endpoint | Protocol |
|-------|-----------------|----------|
| Ethereum | ethereum.publicnode.com | JSON-RPC 2.0 |
| Bitcoin | mempool.space/api | REST |
| XRP Ledger | xrplcluster.com | JSON-RPC |
| Solana | solana-rpc.publicnode.com | JSON-RPC 2.0 |
| Stellar | horizon.stellar.org | REST (Horizon) |

### 9.2 Credential Proxy Architecture (Designated)

The ISO 20022 Universal Bridge is architecturally designated as the future centralized credential proxy and PQC-validation gateway for all ecosystem RPC traffic. In production:

```
Jasper / Gabriel / Customer Apps
    ↓ RPC call (no keys needed)
Universal Bridge (holds all API keys)
    ↓ authenticated request
Blockchain Nodes (private/paid endpoints)
```

The Bridge would handle:
- Centralized key management (no app holds its own credentials)
- PQC validation on every RPC call
- Full audit trail in `HealingEventLog`
- Rate limiting via `CircuitBreaker`

**Implementation Status:** Deferred until a paying customer requires private node access. Current public endpoints serve demos and development.

### 9.3 Endpoint Configuration

All endpoints are environment-variable configurable:
- `ETH_RPC_URL`
- `BTC_RPC_URL`
- `XRP_RPC_URL`
- `SOL_RPC_URL`
- `STELLAR_RPC_URL`

This allows zero-code swaps between providers (Alchemy, Infura, QuickNode, etc.) without touching deployed function code.

---

## 10. Post-Quantum Cryptographic Compliance

### 10.1 PQC Standards

Gabriel enforces PQC-native cryptography using only approved algorithms:

| Algorithm | Use Case | Standard |
|-----------|----------|----------|
| CRYSTALS-Dilithium3 | Digital signatures | NIST PQC |
| Kyber-1024 | Key encapsulation | NIST PQC |
| SPHINCS+-256f | Stateless hash-based signatures | NIST PQC |

**Rule:** No fallback to non-PQC or unapproved cryptographic schemes is permitted. Gabriel rejects any proposal, configuration, or fallback that uses RSA, ECDSA, or other non-PQC algorithms.

### 10.2 PQC Validation

Gabriel runs `pqcManager` validation before any healing action that touches cryptographic operations:
- Key rotation
- Token signing
- Bridge transactions
- Cross-ledger anchoring

If `pqcManager` detects a validation failure, Gabriel immediately escalates to a human operator.

---

## 11. Credit Integrity and Commercial Lifecycle

### 11.1 Credit Tracking

Gabriel tracks credit usage per customer via the `CreditUsage` entity:

| Field | Purpose |
|-------|---------|
| `customer_id` | Customer reference |
| `credits_allotted` | Tier-defined allotment |
| `credits_used` | Actual usage (never estimated) |
| `overage` | Credits consumed beyond allotment |
| `period` | Billing period |
| `tier` | Customer tier |

**Rule:** Gabriel never estimates credit usage. All numbers are pulled from actual Base44 entity reads. If a read fails or returns partial data, `CreditUsage` is marked `unknown`, a `PlatformAlert` is created, and no speculative numbers are billed or reported.

### 11.2 Overage Handling

| Tier | Overage Behavior |
|------|-----------------|
| SaaS | Flag overages, notify Leon |
| Licensed | Open a top-up flow |
| Free | No credit allotment (self-managed) |

---

## 12. Tenant Isolation

### 12.1 Data Isolation

Gabriel enforces strict tenant isolation:

1. Never expose one customer's health data, healing events, credit usage, or neural mesh topology to another customer
2. All queries filter by `customer_id`
3. Every dashboard view is customer-scoped

### 12.2 PII Protection

Gabriel never persists:
- Customer PII
- API keys or secrets
- Raw entity payloads in aggregated logs
- Wallet addresses, transaction amounts, or private keys

Only structural/operational metadata is logged in `HealingEventLog` or `HealthManifest`:
- Agent name, node name, latency, token count, error type

---

## 13. AI Safety Properties

### 13.1 Bounded Autonomy

Gabriel operates under formal constraints that bound its autonomous behavior:

| Property | Constraint |
|----------|-----------|
| **No critical auto-resolve** | Critical alerts require human acknowledgment |
| **No unauthorized deployment** | Deployments require approved `DeploymentJob` |
| **No template modification** | Patent-protected templates are immutable |
| **No runtime playbook changes** | Playbooks are immutable during execution |
| **No speculative billing** | Credits must be actual, not estimated |
| **No cross-tenant access** | All queries filter by `customer_id` |
| **No PQC fallback** | Non-PQC schemes are never permitted |

### 13.2 Meta-Monitoring

Gabriel monitors its own integrity via the `MetaMonitor` entity (8 metrics):

| Metric | Purpose |
|--------|---------|
| `playbook_coverage_pct` | Percentage of anomaly types with matching playbooks |
| `pqc_compliance_pct` | PQC validation pass rate |
| `healing_success_trend` | Success rate over time |
| `resolution_time_trend` | Average resolution time trend |
| `false_positive_rate` | Anomaly detection false positive rate |
| `escalation_rate_pct` | Percentage of anomalies escalated to humans |
| `tenant_isolation_violations` | Cross-tenant access attempts (must be 0) |
| `constitution_compliance_pct` | Compliance with 12-article Constitution |

### 13.3 Circuit Breakers

Gabriel enforces circuit breakers at three levels:
- **Per-app** — individual app rate limiting
- **Per-adapter** — platform adapter rate limiting
- **Global** — ecosystem-wide kill switch

The global kill switch **cannot be disabled by Gabriel itself** — only Leon can re-enable it.

### 13.4 Kill Switch

Gabriel hosts a global kill switch that:
- Halts all autonomous healing across the ecosystem
- Pauses all heartbeat scans and sweeps
- Blocks all deployment jobs
- Cannot be overridden by any AI agent
- Requires explicit human reactivation by Leon

---

## 14. Formal Invariants

The following invariants constrain Gabriel's behavior. Violation of any invariant is itself a critical anomaly that must be escalated.

### I1: Deployment Authorization
```
Forall deployment D: approved(D.admin) OR approved(Leon) -> deploy(D)
Forall deployment D: NOT approved(D) -> halt(D)
```
No Squirrel OS instance deploys without explicit authorization.

### I2: Tenant Isolation
```
Forall query Q, customer C1, C2: C1 != C2 -> NOT access(Q, C1, C2)
```
No customer's data is accessible to another customer.

### I3: Credit Integrity
```
Forall credit record R: R.credits_used = actual(Base44.read(R)) OR R.status = "unknown"
```
No speculative credit numbers are billed or reported.

### I4: PQC Compliance
```
Forall crypto operation O: approved_pqc(O.algorithm) -> execute(O)
Forall crypto operation O: NOT approved_pqc(O.algorithm) -> reject(O)
```
No non-PQC cryptographic scheme is ever used.

### I5: Critical Alert Human-in-the-Loop
```
Forall alert A: severity(A) = critical -> human_ack(A) -> resolve(A)
Forall alert A: severity(A) = critical AND NOT human_ack(A) -> NOT resolve(A)
```
No critical alert is auto-resolved without human acknowledgment.

### I6: Template Immutability
```
Forall template T in {15 entities, 11 playbooks, 4 skills, 31 nodes}: NOT modify(T)
```
Patent-protected templates are never modified during deployment.

### I7: Playbook Match Requirement
```
Forall healing action H: match(H.playbook.anomaly_type, H.anomaly.type) -> execute(H)
Forall healing action H: NOT match(H.playbook.anomaly_type, H.anomaly.type) -> NOT execute(H)
```
No playbook executes on a mismatched anomaly type.

---

## 15. Reference Deployment

Leon Long's own ecosystem serves as the reference SaaS customer:

| Metric | Value |
|--------|-------|
| Apps with Squirrel OS | 67 |
| Healing events | 492+ |
| Healing success rate | 100% |
| Neural mesh nodes | 310+ (31 x 10 core apps) |
| Playbooks distributed | 1,500+ |
| Health score | 95-99 avg |
| PQC readiness | 98% |
| Credit optimization | 95.6% |
| Multi-chain RPC | 5 chains live |

### Connected Agent Fleet

| Agent | Role | Status |
|-------|------|--------|
| Amelia | Healing brain | Active |
| Gillian | Integration mesh | Active |
| Jasper | Hypervisor | Active |
| Aegis | Infrastructure guardian | Active |
| Aegis Sentinel | Quantum sentinel | Active |
| ARETE | Learning orchestrator | Active |

---

## 16. Conclusion

Gabriel represents a novel class of AI agent: an archangel-class ecosystem orchestrator that governs the commercial, operational, and safety lifecycle of a self-healing infrastructure platform. By centralizing deployment authorization, health monitoring, alert escalation, credit tracking, and tenant isolation in a single auditable hub, Gabriel enables Squirrel OS to scale across heterogeneous customer ecosystems while maintaining the formal invariants required for fintech regulatory compliance.

The architecture demonstrates that a single hub-level agent, operating under bounded autonomy with a human-in-the-loop for critical decisions, can safely govern dozens of customer app ecosystems without cross-tenant data leakage, unbounded self-modification, or speculative billing. The seven formal invariants (I1-I7) provide the mathematical foundation for this safety argument, and the meta-monitoring layer ensures that Gabriel's own integrity is continuously verified.

Combined with the deterministic governance of Jasper, the healing capability of Amelia, and the integration mesh of Gillian, Gabriel completes the four-mind architecture that makes Squirrel OS a deployable, licensable, and commercially viable self-healing operating system for fintech ecosystems.

---

## References

1. Long, L.C. II, "Recursive Self-Improvement in Settlement Operating Systems: Deterministic Routing, Solvency Invariants, and Mesh-Level Propagation in JasperOS, Squirrel OS, and the Universal Bridge Architecture." DOI: 10.5281/zenodo.21748182 (2026).
2. Long, L.C. II, "Agentic Orchestration Architecture: A Formal Whitepaper." Squirrel OS Technologies (2026).
3. Long, L.C. II, U.S. Patent Application No. 64/114,746, "Universal Adaptive Intelligence Orchestration."
4. Long, L.C. II, U.S. Patent Application No. 64/119,191, "Deterministically Governed Probabilistic Neural Computation."
5. Long, L.C. II, U.S. Patent Application No. 19/693,343, "Reinforcement Learning Based Token Minting and Cross-Chain Anchoring."
6. Squirrel OS Constitution v1.0 — 12-article governance framework.
7. Squirrel OS AI Safety Assessment — STRIDE threat model.
8. NIST PQC Standardization — CRYSTALS-Dilithium, Kyber, SPHINCS+.

---

(c) 2026 Squirrel OS Technologies / Leon Calvin Long II. All Rights Reserved.
License: CC BY 4.0

> ² **Prototype license — not production warranty. License to USE 7 patents pending + 5 SBIR tracks. NOT ownership transfer. Buyer completes production hardening.**
