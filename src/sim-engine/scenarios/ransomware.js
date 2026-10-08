/**
 * SCENARIO 01: ENTERPRISE RANSOMWARE OUTBREAK (LockBit 3.0 / BlackCat strain)
 * Target: Apex Financial Global (Mid-size Fintech & Custody, 1,200 employees)
 */

export const RANSOMWARE_SCENARIO = {
  id: 'scenario-ransomware-01',
  title: 'Operation Red Vault: Enterprise Ransomware Outbreak',
  threatActor: 'FIN7 / BlackCat Affiliate Group',
  threatType: 'RANSOMWARE',
  industry: 'Fintech & Wealth Services',
  difficulty: 'CRITICAL',
  estimatedDuration: '15-20 min simulation',
  summary:
    'A sophisticated ransomware attack is unfolding across corporate infrastructure. Malicious payloads are spreading via compromised service credentials, threatening client custodial databases and core transaction processing.',
  organizationProfile: {
    name: 'Apex Financial Global',
    industry: 'Financial Services & Investment Platform',
    headcount: 1250,
    annualRevenueUsd: 280000000,
    keyAssets: [
      'Core Custody Ledger (PostgreSQL Cluster)',
      'Active Directory Forest (3 Domain Controllers)',
      'SWIFT / Wire Transfer Gateways',
      'Client Onboarding & KYC Records Vault'
    ],
    regulatoryFrameworks: ['SEC Reg S-P', 'NYDFS 500', 'GDPR', 'SOC 2 Type II']
  },
  initialState: {
    securityScore: 78,
    businessContinuity: 95,
    financialImpact: 0,
    downtimeHours: 0,
    dataExposureRecords: 0,
    reputationRisk: 'LOW',
    systemsAffected: 0,
    totalEndpoints: 450,
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
    // ----------------------------------------------------
    // EVENT 1: Initial Anomaly & Credential Abuse
    // ----------------------------------------------------
    {
      id: 'evt-01-auth',
      timestamp: '09:42 EST',
      elapsedMinutes: 0,
      title: 'Suspicious Administrative Authentication Detected',
      category: 'INITIAL_ACCESS',
      severity: 'MEDIUM',
      headline: 'Privileged service account logged in from unusual geographic VPN endpoint.',
      detailedBrief:
        'At 09:42:15, Azure AD Identity Protection triggered a medium-severity anomaly for service account svc-backup-adm. Authentication originated from an IP address mapped to Romania via an unmanaged VPN portal without Hardware FIDO2 MFA enforcement. Three subsequent Kerberos ticket requests (TGT) were issued within 90 seconds targeting Domain Controller DC-01.',
      affectedAssets: ['Azure AD / Entra ID Gateway', 'VPN Concentrator (vpn-ext-02)', 'Domain Controller DC-01'],
      mitreTactics: ['T1078.002 Valid Accounts (Domain Accounts)', 'T1133 External Remote Services'],
      telemetryLogs: [
        {
          source: 'Azure AD Identity',
          timestamp: '09:42:18',
          logText: 'Risk Detection: Anonymous IP Login + Impossible Travel for svc-backup-adm (IP: 185.220.101.44)',
          level: 'WARN'
        },
        {
          source: 'Palo Alto NGFW',
          timestamp: '09:42:45',
          logText: 'Inbound VPN tunnel established: user=svc-backup-adm client_os=Unknown-Linux proto=SSLv3',
          level: 'WARN'
        },
        {
          source: 'CrowdStrike Falcon',
          timestamp: '09:43:02',
          logText: 'Event 4769: Kerberos service ticket requested for krbtgt/APEXFIN.LOCAL by svc-backup-adm',
          level: 'INFO'
        }
      ],
      indicatorsOfCompromise: [
        { type: 'IP', value: '185.220.101.44 (Mullvad Exit Node)' },
        { type: 'ACCOUNT', value: 'APEXFIN\\svc-backup-adm' },
        { type: 'FILE', value: 'mimikatz_lsass_dump.tmp' }
      ],
      availableDecisions: [
        {
          id: 'dec-01-revoke-quarantine',
          label: 'Revoke Kerberos Tickets, Kill Session & Force Password Reset',
          strategyCategory: 'CONTAINMENT',
          summary: 'Immediately invalidate all active tokens for svc-backup-adm and terminate the VPN session.',
          rationale:
            'Tactical fast-containment limits immediate persistence without disrupting broad engineering operations.',
          securityImpact: 12,
          businessImpact: -2,
          financialCost: 15000,
          downtimeAddedHours: 0.2,
          dataExposureImpact: 0,
          reputationDelta: 0,
          systemsCompromisedDelta: 2,
          nextEventId: 'evt-02-lateral',
          feedbackAnalysis: {
            tacticalPros: [
              'Swiftly severs the primary interactive ingress tunnel.',
              'Preserves enterprise domain stability with minimal collateral interruption.'
            ],
            tacticalCons: [
              'Adversary may have already cached Golden Tickets or installed secondary persistence beacons.'
            ],
            complianceNote: 'Documents immediate forensic session revocation per NIST SP 800-61 Rev 2.'
          }
        },
        {
          id: 'dec-01-full-vpn-lockout',
          label: 'Sever Global VPN Concentrator & Lock All Remote Access',
          strategyCategory: 'CONTAINMENT',
          summary: 'Shut down corporate VPN access completely for all remote engineers and staff.',
          rationale: 'Stops any possible remote exfiltration or ingress instantly, but paralyses remote operations.',
          securityImpact: 16,
          businessImpact: -18,
          financialCost: 65000,
          downtimeAddedHours: 1.5,
          dataExposureImpact: 0,
          reputationDelta: -1,
          systemsCompromisedDelta: 1,
          nextEventId: 'evt-02-lateral',
          feedbackAnalysis: {
            tacticalPros: ['Guaranteed severance of external adversary remote shell access.'],
            tacticalCons: [
              'Causes severe business disruption for 800+ remote workers and halts live trading desk updates.'
            ],
            complianceNote: 'Premature mass outage invocation without confirming blast radius.'
          }
        },
        {
          id: 'dec-01-passive-monitoring',
          label: 'Maintain Honeynet Monitoring to Profile Threat Actor TTPs',
          strategyCategory: 'INVESTIGATION',
          summary: 'Silently mirror traffic to identify threat actor tooling and command-and-control infrastructure.',
          rationale: 'Allows threat intelligence team to gather attribution and identify full command chain.',
          securityImpact: -15,
          businessImpact: 0,
          financialCost: 5000,
          downtimeAddedHours: 0,
          dataExposureImpact: 2500,
          reputationDelta: 0,
          systemsCompromisedDelta: 12,
          nextEventId: 'evt-02-lateral',
          feedbackAnalysis: {
            tacticalPros: ['Captures adversary staging directories and command scripts for threat intel.'],
            tacticalCons: [
              'High-risk gambit in ransomware attacks: adversary leveraged the window to stage lateral encryption!'
            ],
            complianceNote: 'Exposes client records to immediate exfiltration liability.'
          }
        }
      ]
    },

    // ----------------------------------------------------
    // EVENT 2: Privilege Escalation & Lateral Movement
    // ----------------------------------------------------
    {
      id: 'evt-02-lateral',
      timestamp: '10:03 EST',
      elapsedMinutes: 21,
      title: 'Active Directory NTDS.dit Dumping & Lateral WMI Execution',
      category: 'PRIV_ESCALATION',
      severity: 'HIGH',
      headline: 'Adversary deployed Cobalt Strike beacons across 14 staging servers via PsExec and WMI.',
      detailedBrief:
        'Detection rules flagged automated Volume Shadow Copy creation and ntdsutil invoked on secondary Domain Controller DC-02. Attackers staged an encrypted 4.8 GB archive at C:\\PerfLogs\\ntds_backup.zip. Concurrently, lateral SMB traffic surged across VLAN 40 (Infrastructure Management) and VLAN 20 (Billing & Accounting).',
      affectedAssets: ['DC-02 (Domain Controller)', 'VLAN 40 Mgmt Switch', 'Billing Host cluster (BILLING-SRV-01..08)'],
      mitreTactics: ['T1003.003 OS Credential Dumping: NTDS', 'T1047 Windows Management Instrumentation', 'T1021.002 SMB/Windows Admin Shares'],
      telemetryLogs: [
        {
          source: 'CrowdStrike Falcon',
          timestamp: '10:03:12',
          logText: 'CMD execution blocked/flagged: ntdsutil "ac i ntds" "ifm" "create full C:\\PerfLogs" q q',
          level: 'CRITICAL'
        },
        {
          source: 'Splunk SIEM',
          timestamp: '10:04:01',
          logText: 'High volume outbound SMB named pipe connection: \\\\BILLING-SRV-04\\PIPE\\msse-8422-server',
          level: 'HIGH'
        },
        {
          source: 'Darktrace Network AI',
          timestamp: '10:05:40',
          logText: 'Unusual lateral beaconing detected: 14 internal endpoints polling 194.26.29.112:443 over TLS 1.3',
          level: 'CRITICAL'
        }
      ],
      indicatorsOfCompromise: [
        { type: 'IP', value: '194.26.29.112 (Bulletproof Hosting C2)' },
        { type: 'HASH', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
        { type: 'FILE', value: 'C:\\PerfLogs\\ntds_backup.zip' }
      ],
      availableDecisions: [
        {
          id: 'dec-02-segment-vlans',
          label: 'Apply Micro-Segmentation: Quarantine VLAN 20 & 40, Preserve DC-01',
          strategyCategory: 'CONTAINMENT',
          summary: 'Isolate affected billing and infrastructure VLANs at core switch level; force Kerberos ticket rotation.',
          rationale: 'Cuts lateral spread to custody servers while maintaining essential corporate networks.',
          securityImpact: 15,
          businessImpact: -8,
          financialCost: 35000,
          downtimeAddedHours: 0.8,
          dataExposureImpact: 0,
          reputationDelta: 0,
          systemsCompromisedDelta: 4,
          nextEventId: 'evt-03-encryption',
          feedbackAnalysis: {
            tacticalPros: [
              'Restricts attacker blast radius from crossing into Core Custody databases.',
              'Preserves client-facing web application uptime.'
            ],
            tacticalCons: [
              'Billing transaction reconciliations delayed for 2 hours during ticket resets.'
            ],
            complianceNote: 'Aligns with zero-trust network segmentation guidelines (NIST SP 800-207).'
          }
        },
        {
          id: 'dec-02-isolate-endpoint-edr',
          label: 'Host-Level EDR Network Containment on 14 Flagged Hosts Only',
          strategyCategory: 'CONTAINMENT',
          summary: 'Use CrowdStrike/EDR API to isolate the 14 identified beaconing endpoints from the local network.',
          rationale: 'Targeted surgical containment with minimal impact on other corporate services.',
          securityImpact: 5,
          businessImpact: -2,
          financialCost: 20000,
          downtimeAddedHours: 0.3,
          dataExposureImpact: 5000,
          reputationDelta: 0,
          systemsCompromisedDelta: 18,
          nextEventId: 'evt-03-encryption',
          feedbackAnalysis: {
            tacticalPros: ['Lowest operational friction for the business.'],
            tacticalCons: [
              'Insufficient: Attackers had already deployed staging scripts on 9 unmonitored legacy endpoints without EDR sensor coverage!'
            ],
            complianceNote: 'EDR coverage gap contributed to continued lateral movement.'
          }
        },
        {
          id: 'dec-02-full-forest-rebuild',
          label: 'Sever All Domain Controllers & Initiate Full AD Forest Recovery',
          strategyCategory: 'CONTAINMENT',
          summary: 'Take all 3 Domain Controllers offline immediately and initiate bare-metal recovery sequence.',
          rationale: 'Total containment of identity boundary.',
          securityImpact: 20,
          businessImpact: -35,
          financialCost: 190000,
          downtimeAddedHours: 4.5,
          dataExposureImpact: 0,
          reputationDelta: -2,
          systemsCompromisedDelta: 0,
          nextEventId: 'evt-03-encryption',
          feedbackAnalysis: {
            tacticalPros: ['Completely neutralizes any domain-level golden tickets and Kerberos compromises.'],
            tacticalCons: [
              'Catastrophic operational halt: all authentication, email, and customer banking sessions collapse simultaneously.'
            ],
            complianceNote: 'Disproportionate initial reaction before validating DC-01 integrity.'
          }
        }
      ]
    },

    // ----------------------------------------------------
    // EVENT 3: Ransomware Execution & Mass Encryption
    // ----------------------------------------------------
    {
      id: 'evt-03-encryption',
      timestamp: '10:24 EST',
      elapsedMinutes: 42,
      title: 'Mass Ransomware Execution & File System Encryption',
      category: 'IMPACT',
      severity: 'CRITICAL',
      headline: 'LockBit 3.0 executable running on 37 endpoints; .locked extension appended to file shares.',
      detailedBrief:
        'A scheduled task "SystemHealthCheck" triggered at 10:24:00 across multiple servers. VSS shadow copies were purged via "vssadmin delete shadows /all /quiet". AES-256 + RSA-4096 encryption routines started locking virtual machine hypervisors and SMB corporate shared drives. Ransom notes titled "README_RESTORE_FILES.txt" dropped in all root directories.',
      affectedAssets: ['ESXi Cluster 01 & 02 (18 VMs)', 'Corporate NAS Storage (San-01)', 'Accounting Department Laptops (19)'],
      mitreTactics: ['T1486 Data Encrypted for Impact', 'T1490 Inhibit System Recovery', 'T1059.001 PowerShell'],
      telemetryLogs: [
        {
          source: 'Storage SAN-01 Alert',
          timestamp: '10:24:14',
          logText: 'High I/O IOPS spike on volume VOL_PROD_SHARED: 92,000 IOPS write activity, entropy > 7.99',
          level: 'CRITICAL'
        },
        {
          source: 'CrowdStrike Falcon',
          timestamp: '10:24:45',
          logText: 'Process launch blocked: cmd.exe /c "vssadmin.exe delete shadows /all /quiet & bcdedit /set default bootstatuspolicy ignoreallfailures"',
          level: 'CRITICAL'
        },
        {
          source: 'Helpdesk Queue',
          timestamp: '10:26:00',
          logText: '28 tickets opened in 3 minutes: "Desktop wallpaper changed to black text demand, files won\'t open"',
          level: 'CRITICAL'
        }
      ],
      indicatorsOfCompromise: [
        { type: 'HASH', value: '4a3b7c89f21d6e5a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a' },
        { type: 'FILE', value: 'README_RESTORE_FILES.txt' },
        { type: 'DOMAIN', value: 'lockbit777onion.tor2web.io' }
      ],
      availableDecisions: [
        {
          id: 'dec-03-storage-snapshot-quarantine',
          label: 'Trigger Immutable Storage Air-Gap, Power Down Hypervisors & Sever Hyper-V/ESXi',
          strategyCategory: 'CONTAINMENT',
          summary: 'Halt disk writes immediately at the hardware SAN layer and freeze hypervisors before encryption reaches secondary LUNs.',
          rationale: 'Saves 70% of virtual disks from encryption and preserves clean storage snapshots.',
          securityImpact: 14,
          businessImpact: -15,
          financialCost: 75000,
          downtimeAddedHours: 1.8,
          dataExposureImpact: 0,
          reputationDelta: -1,
          systemsCompromisedDelta: 5,
          nextEventId: 'evt-04-exfiltration',
          feedbackAnalysis: {
            tacticalPros: [
              'Protects core database volumes and prevents encryption of the secondary backup repository.',
              'Hardens forensic chain of custody.'
            ],
            tacticalCons: [
              'Requires graceful restart sequence of 200+ microservices post-containment.'
            ],
            complianceNote: 'Essential action to protect transaction records under FINRA Rule 4370.'
          }
        },
        {
          id: 'dec-03-pay-ransom-early',
          label: 'Contact Threat Actor Immediately via Tor Portal to Negotiate Decryptor',
          strategyCategory: 'NEGOTIATION',
          summary: 'Initiate communication with ransomware operator to obtain test decryption keys.',
          rationale: 'Attempt to prevent further business disruption and recover locked files quickly.',
          securityImpact: -22,
          businessImpact: 5,
          financialCost: 1500000,
          downtimeAddedHours: 0.5,
          dataExposureImpact: 15000,
          reputationDelta: -3,
          systemsCompromisedDelta: 12,
          nextEventId: 'evt-04-exfiltration',
          feedbackAnalysis: {
            tacticalPros: ['May buy time while negotiating decryptor validity.'],
            tacticalCons: [
              'Violates OFAC sanctions policy if threat actor is affiliated with sanctioned entities!',
              'Does not remediate root cause: threat actor still retains full persistent access.'
            ],
            complianceNote: 'Severe regulatory risk under US Treasury OFAC Ransomware Advisory.'
          }
        },
        {
          id: 'dec-03-isolate-switches-restore',
          label: 'Physically Disconnect Building Floor Core Switches & Bring Up Offline Backups',
          strategyCategory: 'RECOVERY',
          summary: 'Physically disconnect core distribution switches, isolate building subnets, and begin offline immutable backup restoration.',
          rationale: 'Stops lateral network propagation while recovery engineers begin parallel re-imaging.',
          securityImpact: 18,
          businessImpact: -20,
          financialCost: 90000,
          downtimeAddedHours: 2.2,
          dataExposureImpact: 0,
          reputationDelta: -1,
          systemsCompromisedDelta: 2,
          nextEventId: 'evt-04-exfiltration',
          feedbackAnalysis: {
            tacticalPros: [
              'Complete physical severance prevents any remaining malware worms from reaching backup appliances.'
            ],
            tacticalCons: [
              'Restoration from cold storage takes significant engineering overhead.'
            ],
            complianceNote: 'Exemplifies defense-in-depth isolation protocols.'
          }
        }
      ]
    },

    // ----------------------------------------------------
    // EVENT 4: Data Exfiltration & Double Extortion
    // ----------------------------------------------------
    {
      id: 'evt-04-exfiltration',
      timestamp: '10:31 EST',
      elapsedMinutes: 49,
      title: 'Double Extortion: 850 GB Sensitive Data Exfiltration Detected',
      category: 'EXFILTRATION',
      severity: 'CRITICAL',
      headline: 'Threat actors exfiltrated confidential client KYC documents and custodial tax ID records prior to encryption.',
      detailedBrief:
        'Network telemetry retrospective revealed that between 06:15 and 09:30 EST (prior to encryption), 852 GB was compressed via 7-Zip and transferred via rclone over HTTPS to Mega.nz and Wasabi cloud storage endpoints. The exfiltrated data includes passport scans, bank account details, and internal executive communications.',
      affectedAssets: ['Custodial Client KYC DB', 'Executive SharePoint Storage', 'External Gateway (fw-border-01)'],
      mitreTactics: ['T1567.002 Exfiltration to Cloud Storage', 'T1560.001 Archive via Utility: 7-Zip', 'T1048 Exfiltration Over Alternative Protocol'],
      telemetryLogs: [
        {
          source: 'Zscaler Cloud Proxy',
          timestamp: '10:31:05',
          logText: 'High volume transfer alert: 852.4 GB egress to mega.nz api endpoints over user-agent "rclone/v1.62.2"',
          level: 'CRITICAL'
        },
        {
          source: 'Varonis Data Security',
          timestamp: '10:31:40',
          logText: 'Unusual mass file read event on share \\\\FIN-VAULT\\KYC_CLIENTS: 44,200 PDF files accessed in 90 min',
          level: 'CRITICAL'
        },
        {
          source: 'DNS Analytics (Infoblox)',
          timestamp: '10:32:10',
          logText: 'Query spike for dynamic staging subdomains: *.s3.wasabisys.com and megaupload-storage[.]is',
          level: 'HIGH'
        }
      ],
      indicatorsOfCompromise: [
        { type: 'DOMAIN', value: 's3.wasabisys.com / vault-sync-eu-01' },
        { type: 'ACCOUNT', value: 'Service_Sync_Daemon' },
        { type: 'HASH', value: '8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a' }
      ],
      availableDecisions: [
        {
          id: 'dec-04-legal-notification-contain',
          label: 'Notify General Counsel, Retain Incident Counsel & Invoke 72h Regulatory Clock',
          strategyCategory: 'COMMUNICATIONS',
          summary: 'Bring external legal breach counsel under attorney-client privilege, notify cybersecurity insurers, and draft regulatory disclosure notifications.',
          rationale: 'Safeguards legal liability under SEC, NYDFS, and GDPR while managing breach notifications lawfully.',
          securityImpact: 10,
          businessImpact: -5,
          financialCost: 120000,
          downtimeAddedHours: 0.5,
          dataExposureImpact: 45000,
          reputationDelta: -1,
          systemsCompromisedDelta: 0,
          nextEventId: 'evt-05-demand',
          feedbackAnalysis: {
            tacticalPros: [
              'Preserves attorney-client privilege for technical root-cause investigation reports.',
              'Ensures strict adherence to mandatory regulatory deadlines (SEC 4-day, GDPR 72-hour).'
            ],
            tacticalCons: ['Increases upfront legal retainer and cyber insurance deductible costs.'],
            complianceNote: 'Mandatory compliance with SEC Form 8-K Item 1.05 and NYDFS Part 500.17.'
          }
        },
        {
          id: 'dec-04-conceal-and-negotiate',
          label: 'Attempt Private Non-Disclosure Settlement with Threat Actor to Avoid Public Leak',
          strategyCategory: 'NEGOTIATION',
          summary: 'Negotiate secretly with the extortionist to delete the exfiltrated records without filing regulatory disclosures.',
          rationale: 'Attempt to protect stock valuation and brand reputation by avoiding news headlines.',
          securityImpact: -25,
          businessImpact: -10,
          financialCost: 650000,
          downtimeAddedHours: 0,
          dataExposureImpact: 120000,
          reputationDelta: -4,
          systemsCompromisedDelta: 8,
          nextEventId: 'evt-05-demand',
          feedbackAnalysis: {
            tacticalPros: ['Briefly postpones media disclosure.'],
            tacticalCons: [
              'Catastrophic failure mode: Threat actors routinely sell the data anyway or return for second extortions!',
              'Covering up breach leads to criminal SEC sanctions and executive liability.'
            ],
            complianceNote: 'Severe violation of federal disclosure mandates; exposes board to personal sanctions.'
          }
        },
        {
          id: 'dec-04-cloud-sinkhole-legal-takedown',
          label: 'Coordinate Cloud Provider Takedown (Wasabi/Mega) & Triage Compromised Datasets',
          strategyCategory: 'INVESTIGATION',
          summary: 'Issue emergency DMCA/Law Enforcement subpoenas to Mega and Wasabi to freeze adversary storage buckets.',
          rationale: 'Directly attempts to interdict and delete the exfiltrated data before publication on leak sites.',
          securityImpact: 12,
          businessImpact: -3,
          financialCost: 45000,
          downtimeAddedHours: 0.3,
          dataExposureImpact: 22000,
          reputationDelta: 0,
          systemsCompromisedDelta: 0,
          nextEventId: 'evt-05-demand',
          feedbackAnalysis: {
            tacticalPros: [
              'Proactively disrupts adversary monetization and successfully locked one remote Wasabi bucket.',
              'Demonstrates active remediation effort to regulatory bodies.'
            ],
            tacticalCons: [
              'Adversary likely maintains secondary offline mirrors of the exfiltrated archive.'
            ],
            complianceNote: 'Supports mitigation credit under FTC and GDPR enforcement guidelines.'
          }
        }
      ]
    },

    // ----------------------------------------------------
    // EVENT 5: Ransom Demand & Executive Ultimatum
    // ----------------------------------------------------
    {
      id: 'evt-05-demand',
      timestamp: '10:38 EST',
      elapsedMinutes: 56,
      title: 'Formal $4.5M Ransom Demand & 24-Hour Dark Web Leak Ultimatum',
      category: 'IMPACT',
      severity: 'CRITICAL',
      headline: 'Ransomware syndicate published proof-of-concept files on Tor leak site; countdown clock ticking.',
      detailedBrief:
        'The threat actor posted 5 redacted client passport scans and the CEO\'s internal emails onto their Tor .onion blog. An encrypted negotiation portal message demands $4,500,000 USD in Monero (XMR) within 24 hours. Failure to pay will trigger public release of all 852 GB and permanent deletion of the private decryption key.',
      affectedAssets: ['Company Brand & Market Trust', 'Executive Leadership Board', 'Client Relations Desk'],
      mitreTactics: ['T1651 Cloud Administration Command', 'T1486 Data Encrypted for Impact'],
      telemetryLogs: [
        {
          source: 'Tor Threat Intel Feed',
          timestamp: '10:38:15',
          logText: 'Dark Web Monitor: New post on "BlackCat/ALPHV Blog": "Apex Financial - 850GB Custodial Data Leaked Soon"',
          level: 'CRITICAL'
        },
        {
          source: 'Customer Support Desk',
          timestamp: '10:39:20',
          logText: 'Institutional clients calling regarding Twitter/X rumors of service instability',
          level: 'HIGH'
        },
        {
          source: 'Crisis Management Bridge',
          timestamp: '10:40:00',
          logText: 'Executive committee assembled: CISO, CEO, CFO, General Counsel, External IR Lead',
          level: 'INFO'
        }
      ],
      indicatorsOfCompromise: [
        { type: 'DOMAIN', value: 'alphvleak76q2w8sdjf.onion' },
        { type: 'FILE', value: 'PROOF_SAMPLE_PASSPORTS.7z' },
        { type: 'ACCOUNT', value: 'XMR: 888tNkZrPN6JsE5x6P2d4s...' }
      ],
      availableDecisions: [
        {
          id: 'dec-05-refuse-and-restore',
          label: 'Refuse Ransom, Activate Crisis Comms & Execute Clean Immutable Rebuild',
          strategyCategory: 'RECOVERY',
          summary: 'Reject extortion outright. Issue transparent press release, activate identity theft protection for impacted clients, and rebuild from clean verified snapshots.',
          rationale: 'Maintains organizational integrity, avoids OFAC liability, and relies on verified cyber resilience.',
          securityImpact: 20,
          businessImpact: -10,
          financialCost: 280000,
          downtimeAddedHours: 3.5,
          dataExposureImpact: 0,
          reputationDelta: 1,
          systemsCompromisedDelta: 0,
          nextEventId: 'evt-06-containment-wrapup',
          feedbackAnalysis: {
            tacticalPros: [
              'Zero funds channeled to cybercriminal syndicates or hostile nation-state actors.',
              'Transparent communication builds long-term institutional client respect and regulatory trust.',
              'Proven clean backup architecture ensures verifiable recovery without backdoor decrypter risks.'
            ],
            tacticalCons: [
              'Full operational re-imaging takes 3-4 days of intense engineering shifts.'
            ],
            complianceNote: 'Best-in-class adherence to CISA and FBI ransomware guidance.'
          }
        },
        {
          id: 'dec-05-hire-negotiator-stall',
          label: 'Engage Specialized Ransom Negotiator to Stall and Buy Recovery Time',
          strategyCategory: 'NEGOTIATION',
          summary: 'Hire professional ransomware response negotiators (e.g. Coveware/Arete) to engage threat actors in prolonged dialogue while engineers complete restoration.',
          rationale: 'Delays public leak while giving forensics team crucial extra hours to finish system hardening.',
          securityImpact: 14,
          businessImpact: -4,
          financialCost: 110000,
          downtimeAddedHours: 1.2,
          dataExposureImpact: 0,
          reputationDelta: 0,
          systemsCompromisedDelta: 0,
          nextEventId: 'evt-06-containment-wrapup',
          feedbackAnalysis: {
            tacticalPros: [
              'Successfully delayed dark web publication by 48 hours without paying ransom.',
              'Allowed recovery engineers to bring the primary custody database back online safely.'
            ],
            tacticalCons: [
              'Costs $110,000 in specialized crisis response consulting fees.'
            ],
            complianceNote: 'Recognized industry practice supported by cyber insurance carriers.'
          }
        },
        {
          id: 'dec-05-pay-full-demand',
          label: 'Capitulate: Pay $4.5M Ransom via Cyber Insurance Cryptotransfer',
          strategyCategory: 'NEGOTIATION',
          summary: 'Authorize emergency cryptocurrency payout to obtain decryptor and non-publication guarantee.',
          rationale: 'Belief that immediate payment will swiftly end business downtime and avoid public brand exposure.',
          securityImpact: -30,
          businessImpact: 12,
          financialCost: 4500000,
          downtimeAddedHours: 1.0,
          dataExposureImpact: 85000,
          reputationDelta: -3,
          systemsCompromisedDelta: 0,
          nextEventId: 'evt-06-containment-wrapup',
          feedbackAnalysis: {
            tacticalPros: ['Received decryption utility.'],
            tacticalCons: [
              'Decryption utility failed on 38% of corrupted databases due to key corruption!',
              'Massive direct financial loss of $4.5M and marked the organization as an easy target for follow-up extortions.'
            ],
            complianceNote: 'Potential OFAC enforcement inquiry regarding beneficiary attribution.'
          }
        }
      ]
    },

    // ----------------------------------------------------
    // EVENT 6: Containment Verification & System Eradication
    // ----------------------------------------------------
    {
      id: 'evt-06-containment-wrapup',
      timestamp: '11:18 EST',
      elapsedMinutes: 96,
      title: 'Incident Containment Declared & Forensic Eradication Commenced',
      category: 'RECOVERY',
      severity: 'MEDIUM',
      headline: 'Threat actor command channels terminated; root cause identified; system eradication in progress.',
      detailedBrief:
        'Incident Commander declared active operational containment at 11:18 EST. Forensic analysis confirmed initial breach vector was an unpatched remote-code execution vulnerability in the legacy self-hosted VPN appliance (CVE-2023-46805) coupled with single-factor service account credentials. All adversary persistence hooks have been excised.',
      affectedAssets: ['Perimeter Firewalls', 'All Domain Controllers', 'Core Database Cluster'],
      mitreTactics: ['T1190 Exploit Public-Facing Application', 'T1070 Indicator Removal on Host'],
      telemetryLogs: [
        {
          source: 'Mandiant / Forensic Team',
          timestamp: '11:18:02',
          logText: 'Zero adversary beaconing detected across all monitored subnets in last 45 minutes',
          level: 'INFO'
        },
        {
          source: 'Network Operations Center',
          timestamp: '11:20:15',
          logText: 'Core Transaction Clearing Engine online and processing pending custody batches',
          level: 'INFO'
        },
        {
          source: 'Executive Incident Bridge',
          timestamp: '11:25:00',
          logText: 'Containment phase certified. Moving to Executive Post-Mortem and Remediation Reporting',
          level: 'INFO'
        }
      ],
      indicatorsOfCompromise: [
        { type: 'FILE', value: 'cve-2023-46805_webshell.jsp (Eradicated)' },
        { type: 'ACCOUNT', value: 'svc-backup-adm (Revoked and Deleted)' }
      ],
      availableDecisions: [
        {
          id: 'dec-06-complete-audit-harden',
          label: 'Authorize Comprehensive Zero-Trust Hardening & Third-Party Code Audit',
          strategyCategory: 'BUSINESS_CONTINUITY',
          summary: 'Enforce hardware FIDO2 keys across all service accounts, deploy micro-segmentation, and commission external red team audit.',
          rationale: 'Transforms catastrophic event into a permanent modern enterprise security posture.',
          securityImpact: 22,
          businessImpact: 8,
          financialCost: 85000,
          downtimeAddedHours: 0.5,
          dataExposureImpact: 0,
          reputationDelta: 2,
          systemsCompromisedDelta: 0,
          nextEventId: 'SIMULATION_COMPLETE',
          feedbackAnalysis: {
            tacticalPros: [
              'Addresses fundamental root cause vulnerabilities.',
              'Restores full institutional stakeholder confidence.'
            ],
            tacticalCons: ['Requires 90-day ongoing sprint commitment from engineering teams.'],
            complianceNote: 'Meets highest SEC and NYDFS remediation standards.'
          }
        },
        {
          id: 'dec-06-minimum-patch-resume',
          label: 'Apply Emergency Patch to VPN Only & Resume Standard Commercial Operations',
          strategyCategory: 'BUSINESS_CONTINUITY',
          summary: 'Patch the immediate CVE flaw on the perimeter firewall and resume standard operations to minimize further cost.',
          rationale: 'Quickest return to business normal with minimum immediate capital outlay.',
          securityImpact: 2,
          businessImpact: 15,
          financialCost: 15000,
          downtimeAddedHours: 0,
          dataExposureImpact: 0,
          reputationDelta: 0,
          systemsCompromisedDelta: 0,
          nextEventId: 'SIMULATION_COMPLETE',
          feedbackAnalysis: {
            tacticalPros: ['Lowest immediate financial cost.'],
            tacticalCons: [
              'Leaves fundamental identity governance and lateral movement architectural flaws unaddressed.'
            ],
            complianceNote: 'Fails to satisfy regulatory root-cause remediation mandates.'
          }
        }
      ]
    }
  ]
};
