import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  Building2, MonitorCheck, Users, Target, Banknote, 
  Percent, DollarSign, Rocket, Megaphone, AlertTriangle, 
  TrendingUp, Activity, CheckCircle2, XCircle, Zap, BrainCircuit
} from 'lucide-react';
import { cn } from './lib/utils';
import { runAudit, AuditInputs, CPL_BENCHMARKS, AuditResults } from './auditEngine';

// --- Reusable UI Primitives ---
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl", className)}>
    {children}
  </div>
);

const Label = ({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) => (
  <label className="flex items-center gap-2 text-sm font-medium tracking-wide text-gray-300 mb-2">
    {Icon && <Icon className="w-4 h-4 text-blue-400" />}
    {children}
  </label>
);

export default function App() {
  const [inputs, setInputs] = useState<AuditInputs>({
    industry: 'E-commerce / Retail',
    hasCRM: false,
    hasSalesTeam: false,
    targetRevenue: 100000,
    averageCheck: 500,
    conversionRate: 2,
    currentSpend: 5000,
    businessAge: 'Startup',
    marketingChannels: ['Instagram']
  });

  const handleInput = (key: keyof AuditInputs, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const results: AuditResults = useMemo(() => runAudit(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium text-sm mb-6"
          >
            <Zap className="w-4 h-4" />
            Live 2026 Audit Engine
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text"
          >
            Smart Marketing Budget Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Transform your static business metrics into dynamic growth projections. 
            Adjust the parameters below to instantly visualize your risk and efficiency report.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ----- LEFT COLUMN: INPUT FORM ----- */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 space-y-6"
          >
            <Card className="border-t-4 border-t-blue-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px]"></div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6 text-blue-400" />
                Diagnostic Inputs
              </h2>
              
              <div className="space-y-5">
                {/* Q1: Industry */}
                <div>
                  <Label icon={Building2}>1. Industry</Label>
                  <select 
                    value={inputs.industry}
                    onChange={(e) => handleInput('industry', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                  >
                    {Object.keys(CPL_BENCHMARKS).map(ind => (
                      <option key={ind} value={ind} className="bg-gray-900">{ind}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Q2: CRM */}
                  <div 
                    onClick={() => handleInput('hasCRM', !inputs.hasCRM)}
                    className={cn(
                      "cursor-pointer border rounded-xl p-4 transition-all duration-300 flex flex-col items-center justify-center gap-2",
                      inputs.hasCRM ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                    )}
                  >
                    <MonitorCheck className="w-6 h-6" />
                    <span className="text-sm font-medium text-center">2. Using CRM?</span>
                    {inputs.hasCRM ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-400 opacity-50" />}
                  </div>

                  {/* Q3: Sales Team */}
                  <div 
                    onClick={() => handleInput('hasSalesTeam', !inputs.hasSalesTeam)}
                    className={cn(
                      "cursor-pointer border rounded-xl p-4 transition-all duration-300 flex flex-col items-center justify-center gap-2",
                      inputs.hasSalesTeam ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                    )}
                  >
                    <Users className="w-6 h-6" />
                    <span className="text-sm font-medium text-center">3. Sales Team?</span>
                    {inputs.hasSalesTeam ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-400 opacity-50" />}
                  </div>
                </div>

                {/* Q4: Target Revenue */}
                <div>
                  <Label icon={Target}>4. Target Revenue Monthly ($)</Label>
                  <input 
                    type="number" 
                    value={inputs.targetRevenue}
                    onChange={(e) => handleInput('targetRevenue', Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                {/* Q5: Average Check */}
                <div>
                  <Label icon={Banknote}>5. Average Check / LTV ($)</Label>
                  <input 
                    type="number" 
                    value={inputs.averageCheck}
                    onChange={(e) => handleInput('averageCheck', Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                {/* Q6: Conversion Rate */}
                <div>
                  <Label icon={Percent}>6. Conversion Rate (Lead to Sale %)</Label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="range" 
                      min="0.1" max="25" step="0.1"
                      value={inputs.conversionRate}
                      onChange={(e) => handleInput('conversionRate', Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                    <span className="w-16 text-right font-mono bg-white/5 py-1 px-2 rounded-lg">{inputs.conversionRate}%</span>
                  </div>
                </div>

                {/* Q7: Current Ads Spend */}
                <div>
                  <Label icon={DollarSign}>7. Current Monthly Ads Spend ($)</Label>
                  <input 
                    type="number" 
                    value={inputs.currentSpend}
                    onChange={(e) => handleInput('currentSpend', Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Q8: Business Age */}
                  <div>
                    <Label icon={Rocket}>8. Stage</Label>
                    <select 
                      value={inputs.businessAge}
                      onChange={(e) => handleInput('businessAge', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    >
                      <option className="bg-gray-900">Startup</option>
                      <option className="bg-gray-900">Established</option>
                    </select>
                  </div>

                  {/* Q9: Channel */}
                  <div>
                    <Label icon={Megaphone}>9. Top Channel</Label>
                    <select 
                      value={inputs.marketingChannels?.[0] || 'Instagram'}
                      onChange={(e) => handleInput('marketingChannels', [e.target.value])}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    >
                      <option className="bg-gray-900">Instagram</option>
                      <option className="bg-gray-900">Google Ads</option>
                      <option className="bg-gray-900">Facebook</option>
                      <option className="bg-gray-900">LinkedIn</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ----- RIGHT COLUMN: RESULTS ----- */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 h-full">
                  <h3 className="text-gray-400 mb-2 font-medium">Optimal Lead Volume</h3>
                  <p className="text-4xl font-bold text-white mb-1">{results.baseLeadsNeeded.toLocaleString()}</p>
                  <span className="text-xs text-indigo-300">Targeting {results.customersNeeded} customers</span>
                </Card>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 h-full relative overflow-hidden">
                  <h3 className="text-gray-400 mb-2 font-medium">System Ad Spend</h3>
                  <p className="text-4xl font-bold text-emerald-400 mb-1">
                    ${Math.round(results.systemAdSpend).toLocaleString()}
                  </p>
                  <span className="text-xs text-emerald-400/70">Optimized CPL: ${results.baseCPL.toFixed(2)}</span>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br from-red-500/10 to-orange-500/5 h-full relative overflow-hidden">
                  <h3 className="text-red-400/80 mb-2 font-medium flex gap-1 items-center">
                    <AlertTriangle className="w-4 h-4"/> Efficiency Penalty
                  </h3>
                  <p className="text-4xl font-bold text-red-500 mb-1">
                    +${Math.round(results.efficiencyPenaltyAmount).toLocaleString()}
                  </p>
                  <span className="text-xs text-red-400/70">Wasted via Inefficiency</span>
                </Card>
              </motion.div>
            </div>

            {/* Middle Section: Chart & Comparison Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Funnel Chart */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="h-full">
                <Card className="h-full flex flex-col">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-400" /> Lead to Sale Funnel
                  </h3>
                  <div className="flex-1 min-h-[250px] w-full pb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={results.funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} width={120} />
                        <Tooltip 
                          cursor={{fill: 'rgba(255,255,255,0.05)'}}
                          contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                          {results.funnelData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#10b981'][index % 3]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>

              {/* System vs No System Table */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                <Card className="h-full">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <MonitorCheck className="w-5 h-5 text-blue-400" /> Comparison Analysis
                  </h3>
                  <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="p-4 font-medium text-gray-400">Metric</th>
                          <th className="p-4 font-medium text-emerald-400">Optimized System</th>
                          <th className="p-4 font-medium text-red-400">Current Setup</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="p-4 text-gray-300">Cost Per Lead (CPL)</td>
                          <td className="p-4 font-mono">${results.baseCPL.toFixed(2)}</td>
                          <td className="p-4 font-mono">${results.actualCPL.toFixed(2)}</td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="p-4 text-gray-300">Required Spend</td>
                          <td className="p-4 font-mono text-emerald-300">${Math.round(results.systemAdSpend).toLocaleString()}</td>
                          <td className="p-4 font-mono text-red-300">${Math.round(results.noSystemAdSpend).toLocaleString()}</td>
                        </tr>
                        <tr className="bg-white/5">
                          <td className="p-4 text-gray-300 font-bold">Lost to Inefficiency</td>
                          <td className="p-4">-</td>
                          <td className="p-4 font-mono font-bold text-red-500">+${Math.round(results.efficiencyPenaltyAmount).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* AI Recommendations Agent */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-indigo-500/30">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="p-4 bg-indigo-500/20 rounded-2xl shrink-0">
                    <BrainCircuit className="w-10 h-10 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-indigo-100">AI Growth Agent Insights</h3>
                    <p className="text-indigo-200/70 text-sm mb-6">
                      Based on your industry ({inputs.industry}) and current metric profile, here are 3 tailored strategies to improve your conversion rate and reduce lead costs:
                    </p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <AnimatePresence mode="popLayout">
                        {results.recommendations.map((rec, i) => (
                          <motion.div 
                            key={i + inputs.industry}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            className="bg-black/20 p-4 rounded-xl border border-indigo-500/20"
                          >
                            <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wider">Strategy {i + 1}</div>
                            <p className="text-sm text-gray-300 mt-1 leading-relaxed">{rec}</p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
