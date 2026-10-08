/**
 * SCENARIO 03: PHISHING TO IDENTITY & EXECUTIVE ACCOUNT TAKEOVER (ATO)
 * Target: Apex Financial Global (Executive Suite & Treasury)
 */

export const PHISHING_ATO_SCENARIO = {
  id: 'scenario-phishing-03',
  title: 'Operation Velvet Trap: Spear-Phishing & Executive Account Takeover',
  threatActor: 'APT29 / Midnight Blizzard Imitator',
  threatType: 'ACCOUNT_TAKEOVER',
  industry: 'Fintech & Executive Wealth Management',
  difficulty: 'INTERMEDIATE',
  estimatedDuration: '10-12 min simulation',
  summary:
    'A high-ranking CFO assistant fell victim to an Adversary-in-the-Middle (AiTM) reverse-proxy phishing campaign. Threat actors bypassed legacy SMS MFA, hijacked session cookies, and are staging fraudulent SWIFT treasury wires.',
  organizationProfile: {
    name: 'Apex Financial Global',
    industry: 'Financial Services & Investment Platform',
    headcount: 1250,
    annualRevenueUsd: 280000000,
    keyAssets: [
      'Treasury Wire Authority ($45M daily limit)',
      'Executive M365 Mailboxes & OneDrive',
      'Finance ERP Approval Workflows'
    ],
    regulatoryFrameworks: ['FINRA', 'SEC', 'GLBA', 'SOX Compliance']
  },
  initialState: {
    securityScore: 80,
    businessContinuity: 96,
    financialImpact: 0,
    downtimeHours: 0,
    dataExposureRecords: 0,
    reputationRisk: 'LOW',
    systemsAffected: 0,
    totalEndpoints: 300,
    incidentSeverity: 'SEV-3 (Moderate)',
    currentPhase: 'DETECTION',
    containmentStatus: 'UNCONTAINED',
    decisionsMade: [],
    activeEventIndex: 0,
    eventHistory: [],
    isCompleted: false,
    incidentDurationMinutes: 0
  },
  events: [
    {
      id: 'evt-p01-phish-click',
      timestamp: '08:14 EST',
      elapsedMinutes: 0,
      title: 'AiTM Evilginx Phishing Session Theft Flagged on Executive Account',
      category: 'INITIAL_ACCESS',
      severity: 'HIGH',
      headline: 'Session cookie hijacked for executive assistant with Treasury wire privileges.',
      detailedBrief:
        'An email impersonating DocuSign ("URGENT: Q3 Executive Compensation Review") redirected the user to a reverse-proxy phishing domain login-microsoftonline-verify[.]com. The user entered credentials and SMS OTP code. Attackers captured the active ESTSAuth persistent session cookie and authenticated from an AWS IP in Frankfurt.',
      affectedAssets: ['M365 Tenant: ApexFinGlobal', 'Executive Assistant Mailbox (sarah.j@apexfin.com)', 'Treasury Portal'],
      mitreTactics: ['T1566.002 Spearphishing Link', 'T1539 Steal Web Session Cookie', 'T1110 Brute Force/Bypass MFA'],
      telemetryLogs: [
        {
          source: 'Microsoft Defender for Office 365',
          timestamp: '08:14:22',
          logText: 'Detection: Phish URL with high-entropy token domain login-microsoftonline-verify[.]com clicked by 1 recipient',
          level: 'HIGH'
        },
        {
          source: 'Azure AD Risky Sign-ins',
          timestamp: '08:15:02',
          logText: 'Sign-in from anomalous token replay: user=sarah.j@apexfin.com IP=3.120.45.19 (Frankfurt AWS) Device=Unknown',
          level: 'CRITICAL'
        }
      ],
      indicatorsOfCompromise: [
        { type: 'DOMAIN', value: 'login-microsoftonline-verify[.]com' },
        { type: 'ACCOUNT', value: 'sarah.j@apexfin.com' },
        { type: 'IP', value: '3.120.45.19' }
      ],
      availableDecisions: [
        {
          id: 'dec-p01-kill-sessions-fido2',
          label: 'Revoke All Azure AD Refresh Tokens & Enforce Hardware FIDO2 Security Keys',
          strategyCategory: 'CONTAINMENT',
          summary: 'Use Microsoft Graph API to immediately invalidate all active refresh tokens for the account and enforce Conditional Access requiring FIDO2 WebAuthn keys.',
          rationale: 'Neutralizes session hijacking immediately; prevents any further unauthorized API actions.',
          securityImpact: 16,
          businessImpact: -2,
          financialCost: 12000,
          downtimeAddedHours: 0.2,
          dataExposureImpact: 0,
          reputationDelta: 0,
          systemsCompromisedDelta: 1,
          nextEventId: 'evt-p02-inbox-rules',
          feedbackAnalysis: {
            tacticalPros: ['Destroys hijacked browser session token instantly across all M365 and third-party apps.'],
            tacticalCons: ['User must re-authenticate with physical security key.'],
            complianceNote: 'Meets CISA guidance on phishing-resistant MFA implementation.'
          }
        },
        {
          id: 'dec-p01-password-reset-only',
          label: 'Perform Standard Password Reset Without Revoking Active Sessions',
          strategyCategory: 'CONTAINMENT',
          summary: 'Send password reset link to user without terminating existing OAuth session tokens.',
          rationale: 'Standard basic helpdesk reaction.',
          securityImpact: -12,
          businessImpact: 0,
          financialCost: 2000,
          downtimeAddedHours: 0,
          dataExposureImpact: 1200,
          reputationDelta: -1,
          systemsCompromisedDelta: 4,
          nextEventId: 'evt-p02-inbox-rules',
          feedbackAnalysis: {
            tacticalPros: ['Zero user friction.'],
            tacticalCons: [
              'Fatal flaw: Session tokens remain valid for up to 24 hours even after password changes! Attacker maintained full access.'
            ],
            complianceNote: 'Classic credential remediation antipattern.'
          }
        }
      ]
    },
    {
      id: 'evt-p02-inbox-rules',
      timestamp: '08:35 EST',
      elapsedMinutes: 21,
      title: 'Hidden Mailbox Forwarding Rules & Fraudulent SWIFT Wire Staging',
      category: 'PERSISTENCE',
      severity: 'CRITICAL',
      headline: 'Attacker configured stealth inbox forwarding rule and initiated $1.8M wire authorization request.',
      detailedBrief:
        'Telemetry detected a new Outlook inbox rule named "..." created to auto-delete emails containing keywords "wire", "fraud", "invoice", "SWIFT", and forward all copies to an external ProtonMail address. Simultaneously, an approval notification was spoofed to the CFO for an emergency $1,850,000 vendor payment.',
      affectedAssets: ['Treasury Approval Queue', 'CFO Outlook Mailbox', 'JP Morgan Chase Commercial Gateway'],
      mitreTactics: ['T1114.003 Email Forwarding Rule', 'T1565.002 Transferred Funds'],
      telemetryLogs: [
        {
          source: 'Exchange Online Audit Log',
          timestamp: '08:35:10',
          logText: 'New-InboxRule: Name="..." Actions="DeleteMessage; ForwardTo: external-ap-audit@proton.me"',
          level: 'CRITICAL'
        },
        {
          source: 'Kyriba Treasury Management',
          timestamp: '08:37:44',
          logText: 'Wire Authorization Pending: $1,850,000.00 USD - Beneficiary: Apex Offshore Logistics Ltd (Hong Kong)',
          level: 'CRITICAL'
        }
      ],
      indicatorsOfCompromise: [
        { type: 'ACCOUNT', value: 'external-ap-audit@proton.me' },
        { type: 'FILE', value: 'INVOICE_OCTOBER_EXPENSE_4491.pdf.exe' }
      ],
      availableDecisions: [
        {
          id: 'dec-p02-freeze-treasury-cancel',
          label: 'Freeze Treasury Wire Queue, Purge Mailbox Rules & Notify Primary Bank Partner',
          strategyCategory: 'CONTAINMENT',
          summary: 'Place an emergency hold on all wire releases with JP Morgan Chase, remove the malicious mailbox rule via PowerShell, and institute out-of-band dual voice verification for all pending transactions.',
          rationale: 'Prevents the $1.85M direct theft and secures financial transaction integrity.',
          securityImpact: 20,
          businessImpact: -4,
          financialCost: 20000,
          downtimeAddedHours: 0.5,
          dataExposureImpact: 250,
          reputationDelta: 1,
          systemsCompromisedDelta: 0,
          nextEventId: 'SIMULATION_COMPLETE',
          feedbackAnalysis: {
            tacticalPros: [
              'Successfully intercepted and halted the $1.85M fraudulent wire before SWIFT settlement.',
              'Secured the audit trail for law enforcement.'
            ],
            tacticalCons: ['Legitimate vendor invoices delayed by 4 hours during secondary verification.'],
            complianceNote: 'Exemplary compliance with SOX Section 404 internal financial controls.'
          }
        },
        {
          id: 'dec-p02-approve-wire-check-later',
          label: 'Release Wire Under Assumption It Was Valid Vendor Payment',
          strategyCategory: 'BUSINESS_CONTINUITY',
          summary: 'Allow the wire to proceed to avoid vendor SLA penalties, planning to audit later in the week.',
          rationale: 'Avoid disrupting operations.',
          securityImpact: -30,
          businessImpact: -15,
          financialCost: 1850000,
          downtimeAddedHours: 0,
          dataExposureImpact: 5000,
          reputationDelta: -4,
          systemsCompromisedDelta: 2,
          nextEventId: 'SIMULATION_COMPLETE',
          feedbackAnalysis: {
            tacticalPros: ['None.'],
            tacticalCons: [
              'Irrecoverable financial loss of $1,850,000 wired to an untraceable offshore shell account!'
            ],
            complianceNote: 'Catastrophic failure of financial internal controls; triggers mandatory board inquiry.'
          }
        }
      ]
    }
  ]
};
