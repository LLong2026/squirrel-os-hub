# Stripe Dashboard Setup Guide — Squirrel OS Pricing Tiers

## Instructions for Leon (do this when you have access to Stripe Dashboard)

### Step 1: Log into Stripe Dashboard
Go to https://dashboard.stripe.com

### Step 2: Create 3 Products

#### Product 1: Squirrel OS — Free Tier
- **Name:** Squirrel OS Free
- **Description:** Open-core self-healing infrastructure — 11 healing playbooks, heartbeat monitoring, anomaly detection, audit trail
- **Pricing:** Free ($0)

#### Product 2: Squirrel OS — Licensed Tier
- **Name:** Squirrel OS Licensed
- **Description:** Full neural mesh (31 nodes, 5 layers), PQC adaptation, cross-app monitor, all 15 entities, 4 operational skills, 3 consolidated workflows, pattern learning, self-improvement proposals
- **Pricing:** One-time payment — $25,000 USD (prototype license, not production warranty — license to USE patents, NOT ownership)
- **Type:** One-time

#### Product 3: Squirrel OS — SaaS Tier
- **Name:** Squirrel OS SaaS
- **Description:** Hosted hub (we manage orchestration), full neural mesh, PQC, cross-app monitoring, daily ecosystem reports, critical anomaly escalation, credit tracking, template updates
- **Pricing:** $2,500/month USD (recurring)
- **Type:** Recurring monthly

### Step 3: Get Your API Keys
- Go to Developers → API Keys
- Copy the Secret Key (sk_live_... or sk_test_...)
- Share it with Gabriel via the secret prompt

### Step 4: That's It
Once you provide the secret key, Gabriel will:
- Create all products/prices via API automatically (if you haven't done it manually)
- Deploy a checkout backend function on Gabriel
- Push pricing pages to all 67 apps
- Generate checkout links for each tier

---

## Pricing Summary

| Tier | Price | Billing | Target Customer |
|------|-------|---------|-----------------|
| Free | $0 | Forever free | Small teams testing self-healing AI |
| Licensed | $25,000 | One-time¹ | Fintechs buying the full prototype template |
| SaaS | $2,500/mo | Monthly recurring | Enterprises wanting managed hub |

## What Each Tier Includes

### Free ($0)
- 11 healing playbooks (PB-001 through PB-011)
- Heartbeat monitoring
- Anomaly detection
- Audit trail
- 0 credits included
- No neural mesh
- No PQC
- No cross-app monitor

### Licensed ($25,000 one-time — prototype license)
- Full neural mesh (31 nodes, 5 layers)
- PQC adaptation (CRYSTALS-Dilithium3, Kyber-1024, SPHINCS+-256f)
- Cross-app monitor
- All 15 Squirrel OS entities
- 11 healing playbooks
- 4 operational skills
- 3 consolidated workflows
- Pattern learning
- Self-improvement proposals
- 10,000 credits included

### SaaS ($2,500/month)
- Everything in Licensed, PLUS:
- Hosted hub (we manage the orchestration)
- Cross-app monitoring (we scan for you)
- Daily ecosystem reports
- Critical anomaly escalation
- Credit usage tracking
- Template version updates
- 50,000 credits/month included

> ¹ **Prototype license — not production warranty. License to USE 7 patents pending + 5 SBIR tracks, NOT ownership transfer. Buyer completes production hardening.**
