/**
 * SCENARIO 02: CLOUD INFRASTRUCTURE EXPOSURE & S3 BUCKET LEAK
 * Target: CloudPulse Analytics (SaaS Data Platform, 450 employees)
 */

export const CLOUD_EXPOSURE_SCENARIO = {
  id: 'scenario-cloud-02',
  title: 'Cloud Exposure: IAM Role Hijack & Multi-Tenant S3 Bucket Breach',
  threatActor: 'Scattered Spider / Cloud Ransom Syndicate',
  threatType: 'CLOUD_EXPOSURE',
  industry: 'Enterprise B2B SaaS',
  difficulty: 'ADVANCED',
  estimatedDuration: '12-15 min simulation',
  summary:
    'An orphaned CI/CD AWS credential was discovered and exploited via GitHub code leak, granting attackers administrative role assumption in production AWS accounts and access to multi-tenant client databases.',
  organizationProfile: {
    name: 'CloudPulse Analytics Inc',
    industry: 'Cloud Analytics & Intelligence Platform',
    headcount: 420,
    annualRevenueUsd: 92000000,
    keyAssets: [
      'AWS Multi-Region Production VPCs',
      'Snowflake Data Warehouse Integration',
      'Kubernetes (EKS) Production Cluster',
      'Client Raw Telemetry S3 Data Lakes (12 PB)'
    ],
    regulatoryFrameworks: ['SOC 2 Type II', 'ISO 27001', 'HIPAA BAA', 'GDPR']
  },
  initialState: {
    securityScore: 82,
    businessContinuity: 98,
    financialImpact: 0,
    downtimeHours: 0,
    dataExposureRecords: 0,
    reputationRisk: 'LOW',
    systemsAffected: 0,
    totalEndpoints: 280,
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
      id: 'evt-c01-key-leak',
      timestamp: '14:10 UTC',
      elapsedMinutes: 0,
      title: 'AWS GuardDuty Alert: Anomalous API Calls from Tor Exit Node',
      category: 'INITIAL_ACCESS',
      severity: 'HIGH',
      headline: 'Compromised AWS IAM Access Key AKIA... utilized to enumerate S3 buckets.',
      detailedBrief:
        'AWS GuardDuty triggered finding "UnauthorizedAccess:IAMUser/TorIPCaller". IAM Access Key AKIA-DEPLOY-GITHUB (associated with a contractor who departed 3 weeks ago) was used from a Tor exit IP to invoke DescribeInstances, ListBuckets, and GetCallerIdentity in the us-east-1 production account.',
      affectedAssets: ['AWS Account Root: 4892-0192-3841', 'IAM Role: DeploymentAutomationRole', 'AWS KMS Master Keys'],
      mitreTactics: ['T1552.001 Credentials in Files (GitHub Repo)', 'T1087.004 Cloud Account Discovery'],
      telemetryLogs: [
        {
          source: 'AWS CloudTrail',
          timestamp: '14:10:12',
          logText: 'Event: GetCallerIdentity - UserArn: arn:aws:iam::489201923841:user/ci-deploy - SourceIP: 198.51.100.22 (Tor)',
          level: 'CRITICAL'
        },
        {
          source: 'AWS GuardDuty',
          timestamp: '14:10:45',
          logText: 'Finding: Discovery:S3/AnomalousBehavior - 142 API calls executed in 120 seconds',
          level: 'HIGH'
        }
      ],
      indicatorsOfCompromise: [
        { type: 'ACCOUNT', value: 'AKIAEXAMPLE1234DEPLOY (Leaked Key)' },
        { type: 'IP', value: '198.51.100.22 (Tor Exit Node)' }
      ],
      availableDecisions: [
        {
          id: 'dec-c01-deactivate-and-rotate',
          label: 'Deactivate Compromised Access Key, Invalidate IAM Sessions & Attach Explicit Deny Policy',
          strategyCategory: 'CONTAINMENT',
          summary: 'Immediately deactivate the leaked IAM key and apply an SCP (Service Control Policy) quarantine to restrict API calls to approved VPC CIDRs.',
          rationale: 'Stops automated enumeration without impacting running containerized production workloads.',
          securityImpact: 15,
          businessImpact: -1,
          financialCost: 10000,
          downtimeAddedHours: 0.1,
          dataExposureImpact: 0,
          reputationDelta: 0,
          systemsCompromisedDelta: 1,
          nextEventId: 'evt-c02-persistence',
          feedbackAnalysis: {
            tacticalPros: ['Instantly severs attacker AWS API programmatic interaction.'],
            tacticalCons: ['Must ensure attackers did not already mint short-lived STS tokens or backdoor roles.'],
            complianceNote: 'Standard AWS Well-Architected Incident Response procedure.'
          }
        },
        {
          id: 'dec-c01-lock-aws-account',
          label: 'Apply Global AWS Account Freeze via AWS Organizations (SCP Deny All)',
          strategyCategory: 'CONTAINMENT',
          summary: 'Apply an emergency SCP that denies all actions across the entire AWS account.',
          rationale: 'Absolute guaranteed containment of all cloud resources.',
          securityImpact: 20,
          businessImpact: -30,
          financialCost: 85000,
          downtimeAddedHours: 3.0,
          dataExposureImpact: 0,
          reputationDelta: -2,
          systemsCompromisedDelta: 0,
          nextEventId: 'evt-c02-persistence',
          feedbackAnalysis: {
            tacticalPros: ['Guaranteed zero data leakage.'],
            tacticalCons: ['Shuts down client-facing SaaS APIs globally; breaks SLAs for 400 enterprise clients.'],
            complianceNote: 'Excessive blast radius for an isolated IAM credential compromise.'
          }
        }
      ]
    },
    {
      id: 'evt-c02-persistence',
      timestamp: '14:32 UTC',
      elapsedMinutes: 22,
      title: 'Backdoor IAM Role Creation & S3 Sync Initiation',
      category: 'EXFILTRATION',
      severity: 'CRITICAL',
      headline: 'Attackers assumed role into production telemetry bucket and initiated rclone copy to external AWS account.',
      detailedBrief:
        'Prior to key revocation, attackers leveraged an overly permissive iam:CreateRole permission to create "AWSCloudWatch-SupportRole" with full administrator trust relationships. An automated script began synchronizing s3://prod-customer-analytics-raw to an external AWS account.',
      affectedAssets: ['s3://prod-customer-analytics-raw (Customer PII & Clickstream)', 'IAM Roles: AWSCloudWatch-SupportRole'],
      mitreTactics: ['T1098 Account Manipulation', 'T1537 Transfer Data to Cloud Account'],
      telemetryLogs: [
        {
          source: 'AWS CloudTrail',
          timestamp: '14:32:05',
          logText: 'Event: AssumeRole - RoleArn: arn:aws:iam::489201923841:role/AWSCloudWatch-SupportRole - ExternalID: rogue-session-99',
          level: 'CRITICAL'
        },
        {
          source: 'AWS S3 Access Logs',
          timestamp: '14:33:10',
          logText: 'GetObject burst rate: 1,840 requests/sec across 240,000 objects in analytics prefix',
          level: 'CRITICAL'
        }
      ],
      indicatorsOfCompromise: [
        { type: 'ACCOUNT', value: 'AWSCloudWatch-SupportRole (Rogue IAM Role)' },
        { type: 'DOMAIN', value: 'external-drop-bucket-9941.s3.amazonaws.com' }
      ],
      availableDecisions: [
        {
          id: 'dec-c02-bucket-policy-lock',
          label: 'Apply S3 Bucket Policy Deny-All-External & Delete Rogue IAM Role',
          strategyCategory: 'CONTAINMENT',
          summary: 'Enforce explicit Deny policy on the S3 bucket allowing only internal VPC endpoints; delete rogue IAM role immediately.',
          rationale: 'Instantly breaks cross-account exfiltration stream while allowing internal analytics services to continue.',
          securityImpact: 18,
          businessImpact: -4,
          financialCost: 25000,
          downtimeAddedHours: 0.3,
          dataExposureImpact: 15000,
          reputationDelta: 0,
          systemsCompromisedDelta: 2,
          nextEventId: 'SIMULATION_COMPLETE',
          feedbackAnalysis: {
            tacticalPros: [
              'Terminated rogue exfiltration within 90 seconds of detection.',
              'Preserves forensic CloudTrail logs intact.'
            ],
            tacticalCons: ['15,000 customer analytics records were transferred prior to bucket lockdown.'],
            complianceNote: 'Mandates notification to affected enterprise B2B customers under HIPAA/SOC 2.'
          }
        },
        {
          id: 'dec-c02-delete-entire-bucket',
          label: 'Emergency Delete S3 Bucket to Stop Data Flight',
          strategyCategory: 'RECOVERY',
          summary: 'Delete the S3 bucket to stop the attacker from reading any further files.',
          rationale: 'Drastic measure to prevent any further data exposure.',
          securityImpact: -10,
          businessImpact: -45,
          financialCost: 320000,
          downtimeAddedHours: 8.0,
          dataExposureImpact: 10000,
          reputationDelta: -3,
          systemsCompromisedDelta: 5,
          nextEventId: 'SIMULATION_COMPLETE',
          feedbackAnalysis: {
            tacticalPros: ['Halted data egress.'],
            tacticalCons: [
              'Catastrophic: Destroyed 12 petabytes of customer analytics data! Required days of agonizing tape backup restoration.'
            ],
            complianceNote: 'Gross failure of incident response procedures; violates data retention requirements.'
          }
        }
      ]
    }
  ]
};
