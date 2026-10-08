# Jatin Singh — Personal Technology & Cyber Strategy Portfolio

> **Computer Science Engineer + MBA (IT) / Business Analytics + Cybersecurity Analyst**  
> Operating at the intersection of cybersecurity architecture, business resilience, data analytics, and modern software engineering.

---

## 🎯 Executive Overview

This repository hosts the personal portfolio of **Jatin Singh**, built with React 18 and Tailwind CSS, featuring the interactive flagship cybersecurity project **CyberSim**.

### Professional Positioning
* **Role:** Cybersecurity Analyst — Cyber Strategy & Transformation (Deloitte)
* **Education:** B.Tech Computer Science Engineering + MBA in Information Technology (Business Analytics)
* **Focus:** Incident response decision modeling, identity boundaries, network segmentation, quantitative risk valuation, and modern web systems.

---

## 🚀 Flagship Project: CyberSim

**CyberSim** is an interactive cybersecurity incident decision lab designed to simulate realistic enterprise incident response trade-offs. Rather than presenting multiple-choice quiz questions, it places the practitioner in the Incident Commander seat during active cyber crises.

### Core Capabilities:
1. **Deterministic Simulation Engine:** Models attack progression, indicators of compromise (IOCs), telemetry logs, and state transitions without synthetic LLM hallucinations.
2. **Multi-Vector Enterprise Scenarios:**
   * *Operation Red Vault:* Enterprise Ransomware outbreak (LockBit 3.0 strain) with double extortion.
   * *Cloud Infrastructure Exposure:* AWS IAM credential leak and multi-tenant S3 exfiltration.
   * *Operation Velvet Trap:* Adversary-in-the-Middle (AiTM) Evilginx phishing session theft and fraudulent SWIFT wire staging.
3. **Real-World Operational Trade-Offs:** Balances defensive containment (e.g. total network severance vs. surgical micro-segmentation) against revenue loss, SLA penalties, and legal notification clocks (SEC 4-day, GDPR 72-hour).
4. **Live Telemetry & Posture HUD:** Real-time metrics for Security Posture, Business Continuity, Capital Impact ($), Downtime Hours, and Exfiltrated Records.
5. **NIST SP 800-61 Aligned Post-Mortem Report:** 5-dimension executive scorecard evaluating Security Posture, Business Continuity, Financial Prudence, Data Protection, and Tactical Decisiveness.

---

## 🛠️ Portfolio Architecture & Tech Stack

* **Frontend Framework:** React 18 with functional components and custom state hooks
* **Design System:** Custom dark theme palette with editorial typography, subtle borders, and accessible high-contrast accents
* **Icons:** Lucide React
* **Styling:** Tailwind CSS + CSS Custom Properties
* **Build System:** Webpack / React Scripts

---

## 📂 Project Structure

```text
├── public/
│   ├── index.html          # SEO, OpenGraph, JSON-LD schema
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── Components/
│   │   ├── Portfolio/      # Personal brand, Hero, Projects, Experience, Skills, Journey, Contact
│   │   ├── CyberNavbar/    # Enterprise SOC incident navigation
│   │   ├── IncidentView/   # Real-time telemetry, IOCs, and tactical decision options
│   │   ├── RiskPostureHUD/ # Live metrics: Security, Continuity, Capital Loss, Downtime
│   │   ├── AttackTimeline/ # Chronological incident milestones & audit trail
│   │   ├── ExecutiveDashboard/ # C-suite briefing on business interruption & compliance
│   │   └── PostMortemReport/   # NIST-aligned 5-dimension executive scorecard
│   ├── sim-engine/
│   │   ├── scenarios/      # Ransomware, Cloud Exposure, Phishing ATO
│   │   ├── scoringModel.js # Deterministic state machine & impact calculation
│   │   └── types.js        # Engine constants
│   ├── App.js              # Dual-mode container (Portfolio + CyberSim launcher)
│   └── index.css           # Design tokens and typography
└── package.json
```

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/jatinsingh82/Weather_Website.git

# Install dependencies
npm install

# Start development server
npm start
```

---

## 📬 Contact & Profiles

* **GitHub:** [@jatinsingh82](https://github.com/jatinsingh82)
* **Email:** [immanuel.0747@gmail.com](mailto:immanuel.0747@gmail.com)
* **Role:** Cybersecurity Analyst — Cyber Strategy & Transformation
