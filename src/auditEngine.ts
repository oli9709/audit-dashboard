export interface AuditInputs {
  industry: string;
  hasCRM: boolean;
  hasSalesTeam: boolean;
  targetRevenue: number;
  averageCheck: number;
  conversionRate: number; // in percentage
  currentSpend?: number;
  businessAge?: string;
  marketingChannels?: string[];
}

export interface AuditResults {
  customersNeeded: number;
  baseLeadsNeeded: number;
  actualLeadsNeeded: number;
  baseCPL: number;
  actualCPL: number;
  systemAdSpend: number;
  noSystemAdSpend: number;
  efficiencyPenaltyAmount: number;
  funnelData: { name: string; value: number }[];
  recommendations: string[];
}

export const CPL_BENCHMARKS: Record<string, number> = {
  "E-commerce / Retail": 27.25,
  "B2B / SaaS": 125.00,
  "Healthcare": 41.60,
  "Real Estate": 51.90,
  "Home Services": 45.50,
  "Finance / Insurance": 85.00,
  "Education": 42.50,
  "Other": 23.10
};

export function getNicheRecommendations(industry: string): string[] {
  const recommendationsMap: Record<string, string[]> = {
    "E-commerce / Retail": [
      "Implement persistent cart reminders and dynamic retargeting for abandoned checkouts.",
      "Leverage user-generated content (UGC) and micro-influencers to build social proof.",
      "Optimize product detail pages (PDPs) for mobile with clear, sticky calls-to-action."
    ],
    "B2B / SaaS": [
      "Create high-value lead magnets like whitepapers or free micro-tools.",
      "Implement a structured email nurture sequence tailored to specific buyer personas.",
      "Host live webinars or Q&A sessions to build authority and trust."
    ],
    "Healthcare": [
      "Ensure HIPAA-compliant, seamless appointment booking directly from landing pages.",
      "Highlight patient testimonials and doctor credentials prominently.",
      "Use localized SEO and geo-targeted ads to capture high-intent local searches."
    ],
    "Real Estate": [
      "Utilize high-quality video tours and virtual staging in ad creatives.",
      "Create neighborhood guides to capture top-of-funnel organic traffic.",
      "Implement SMS auto-responders for immediate follow-up on property inquiries."
    ]
  };
  
  return recommendationsMap[industry] || [
    "Implement an immediate automated follow-up system for new leads.",
    "A/B test landing page headlines and hero images tailored to your specific audience.",
    "Add strong social proof and clear guarantees to reduce buyer friction."
  ];
}

export function runAudit(inputs: AuditInputs): AuditResults {
  const {
    industry,
    hasCRM,
    hasSalesTeam,
    targetRevenue,
    averageCheck,
    conversionRate
  } = inputs;

  const convRateDecimal = (conversionRate || 1) / 100;
  
  // Base metrics calculation
  const customersNeeded = targetRevenue / (averageCheck || 1);
  const baseLeadsNeeded = customersNeeded / convRateDecimal;
  
  const baseCPL = CPL_BENCHMARKS[industry] || CPL_BENCHMARKS["Other"];
  
  // Penalty calculations
  let penaltyMultiplier = 1.0;
  if (!hasCRM) penaltyMultiplier += 0.20; // 20% penalty cost
  if (!hasSalesTeam) penaltyMultiplier += 0.20; // 20% penalty cost

  const actualCPL = baseCPL * penaltyMultiplier;
  
  // Real world volume drop-off because of inefficiencies translates to higher costs. 
  // We represent "efficiency penalty" as financial loss and need for more leads.
  // Actually, wait, if your CPL is 40% higher, your Ad Spend is 40% higher to get the SAME leads.
  // System ad spend = perfectly optimized
  const systemAdSpend = baseLeadsNeeded * baseCPL;
  const noSystemAdSpend = baseLeadsNeeded * actualCPL;
  const efficiencyPenaltyAmount = noSystemAdSpend - systemAdSpend;

  // Funnel Data
  const funnelData = [
    { name: "Leads", value: Math.ceil(baseLeadsNeeded) },
    { name: "Prospects/Engaged", value: Math.ceil(baseLeadsNeeded * 0.4) }, // 40% engagement assumption
    { name: "Customers", value: Math.ceil(customersNeeded) }
  ];

  const recommendations = getNicheRecommendations(industry);

  return {
    customersNeeded: Math.ceil(customersNeeded),
    baseLeadsNeeded: Math.ceil(baseLeadsNeeded),
    actualLeadsNeeded: Math.ceil(baseLeadsNeeded), // volume stays the same, cost changes
    baseCPL,
    actualCPL,
    systemAdSpend,
    noSystemAdSpend,
    efficiencyPenaltyAmount,
    funnelData,
    recommendations
  };
}
