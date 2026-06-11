import { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  Building2, MonitorCheck, Users, Target, Banknote,
  Percent, DollarSign, Rocket, Megaphone, AlertTriangle,
  TrendingUp, Activity, CheckCircle2, XCircle, Zap, BrainCircuit, BookOpen
} from 'lucide-react';
import { runAudit, AuditInputs, CPL_BENCHMARKS, AuditResults } from './auditEngine';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import './index.css';

const Card = ({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div className={`glass-card ${className}`} style={style}>{children}</div>
);

const Label = ({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) => (
  <label className="form-label">{Icon && <Icon size={16} color="#3b82f6" />}{children}</label>
);

function NavHeader() {
  const location = useLocation();
  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/blog', label: 'Blog', icon: BookOpen },
  ];
  return (
    <nav className="nav-header">
      <div className="nav-brand"><Zap size={18} color="#3b82f6" />Audit Dashboard</div>
      <div className="nav-links">
        {links.map(({ to, label, icon: Icon }) => {
          const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <Link key={to} to={to} className={`nav-link ${active ? 'nav-link-active' : ''}`}>
              {Icon && <Icon size={14} />}{label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function DashboardPage() {
  const [inputs, setInputs] = useState<AuditInputs>({
    industry: 'E-commerce / Retail', hasCRM: false, hasSalesTeam: false,
    targetRevenue: 100000, averageCheck: 500, conversionRate: 2,
    currentSpend: 5000, businessAge: 'Startup', marketingChannels: ['Instagram']
  });
  const handleInput = (key: keyof AuditInputs, value: any) => setInputs(prev => ({ ...prev, [key]: value }));
  const results: AuditResults = useMemo(() => runAudit(inputs), [inputs]);

  return (
    <div className="app-container">
      <div className="atmosphere-orb orb-1" />
      <div className="atmosphere-orb orb-2" />
      <header className="header-section">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="badge-live">
          <Zap size={16} />Live 2026 Audit Engine
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="page-title">
          Smart Marketing Budget Dashboard
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="page-subtitle">
          Transform your static business metrics into dynamic growth projections.
          Adjust the parameters below to instantly visualize your risk and efficiency report.
        </motion.p>
      </header>

      <div className="grid-layout">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="theme-neutral" style={{ borderTop: '4px solid #3b82f6' }}>
            <h2 className="card-title"><Activity size={24} color="#3b82f6" />Diagnostic Inputs</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <Label icon={Building2}>1. Industry</Label>
                <select value={inputs.industry} onChange={e => handleInput('industry', e.target.value)} className="input-field">
                  {Object.keys(CPL_BENCHMARKS).map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
              <div className="grid-cols-2">
                <div onClick={() => handleInput('hasCRM', !inputs.hasCRM)} className={`toggle-card ${inputs.hasCRM ? 'active' : ''}`}>
                  <MonitorCheck size={24} /><span style={{ fontSize: '0.875rem', fontWeight: 500 }}>2. Using CRM?</span>
                  {inputs.hasCRM ? <CheckCircle2 size={20} /> : <XCircle size={20} style={{ opacity: 0.5 }} />}
                </div>
                <div onClick={() => handleInput('hasSalesTeam', !inputs.hasSalesTeam)} className={`toggle-card ${inputs.hasSalesTeam ? 'active' : ''}`}>
                  <Users size={24} /><span style={{ fontSize: '0.875rem', fontWeight: 500 }}>3. Sales Team?</span>
                  {inputs.hasSalesTeam ? <CheckCircle2 size={20} /> : <XCircle size={20} style={{ opacity: 0.5 }} />}
                </div>
              </div>
              <div className="form-group">
                <Label icon={Target}>4. Target Revenue Monthly ($)</Label>
                <input type="number" value={inputs.targetRevenue} onChange={e => handleInput('targetRevenue', Number(e.target.value))} className="input-field" />
              </div>
              <div className="form-group">
                <Label icon={Banknote}>5. Average Check / LTV ($)</Label>
                <input type="number" value={inputs.averageCheck} onChange={e => handleInput('averageCheck', Number(e.target.value))} className="input-field" />
              </div>
              <div className="form-group">
                <Label icon={Percent}>6. Conversion Rate (Lead to Sale %)</Label>
                <div className="range-container">
                  <input type="range" min="0.1" max="25" step="0.1" value={inputs.conversionRate} onChange={e => handleInput('conversionRate', Number(e.target.value))} />
                  <span className="range-value">{inputs.conversionRate}%</span>
                </div>
              </div>
              <div className="form-group">
                <Label icon={DollarSign}>7. Current Monthly Ads Spend ($)</Label>
                <input type="number" value={inputs.currentSpend} onChange={e => handleInput('currentSpend', Number(e.target.value))} className="input-field" />
              </div>
              <div className="grid-cols-2">
                <div className="form-group">
                  <Label icon={Rocket}>8. Stage</Label>
                  <select value={inputs.businessAge} onChange={e => handleInput('businessAge', e.target.value)} className="input-field">
                    <option>Startup</option><option>Established</option>
                  </select>
                </div>
                <div className="form-group">
                  <Label icon={Megaphone}>9. Top Channel</Label>
                  <select value={inputs.marketingChannels?.[0] || 'Instagram'} onChange={e => handleInput('marketingChannels', [e.target.value])} className="input-field">
                    <option>Instagram</option><option>Google Ads</option><option>Facebook</option><option>LinkedIn</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="theme-neutral stat-card">
                <h3 className="stat-label">Optimal Lead Volume</h3>
                <p className="stat-value">{results.baseLeadsNeeded.toLocaleString()}</p>
                <span className="stat-sub text-cyan">Targeting {results.customersNeeded} customers</span>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="theme-emerald stat-card">
                <h3 className="stat-label">System Ad Spend</h3>
                <p className="stat-value text-emerald">${Math.round(results.systemAdSpend).toLocaleString()}</p>
                <span className="stat-sub text-emerald-bright">Optimized CPL: ${results.baseCPL.toFixed(2)}</span>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="theme-danger stat-card">
                <h3 className="stat-label" style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={16} />Efficiency Penalty
                </h3>
                <p className="stat-value text-danger">+${Math.round(results.efficiencyPenaltyAmount).toLocaleString()}</p>
                <span className="stat-sub text-danger-bright">Wasted via Inefficiency</span>
              </Card>
            </motion.div>
          </div>

          <div className="grid-cols-2">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
              <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <h3 className="card-title"><TrendingUp size={20} color="#8b5cf6" />Lead to Sale Funnel</h3>
                <div style={{ flex: 1, minHeight: '250px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontFamily: 'Outfit' }} width={120} />
                      <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontFamily: 'Outfit' }} />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={36}>
                        {results.funnelData.map((_, i) => <Cell key={`c-${i}`} fill={['#3b82f6', '#8b5cf6', '#10b981'][i % 3]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
              <Card style={{ height: '100%' }}>
                <h3 className="card-title"><MonitorCheck size={20} color="#3b82f6" />Comparison Analysis</h3>
                <div className="comparison-table-wrapper">
                  <table className="comparison-table">
                    <thead><tr><th style={{ color: '#94a3b8' }}>Metric</th><th className="text-emerald-bright">Optimized System</th><th className="text-danger-bright">Current Setup</th></tr></thead>
                    <tbody>
                      <tr><td style={{ color: '#e2e8f0' }}>Cost Per Lead (CPL)</td><td className="font-mono">${results.baseCPL.toFixed(2)}</td><td className="font-mono">${results.actualCPL.toFixed(2)}</td></tr>
                      <tr><td style={{ color: '#e2e8f0' }}>Required Spend</td><td className="font-mono text-emerald-bright">${Math.round(results.systemAdSpend).toLocaleString()}</td><td className="font-mono text-danger-bright">${Math.round(results.noSystemAdSpend).toLocaleString()}</td></tr>
                      <tr style={{ background: 'rgba(255,255,255,0.03)' }}><td className="font-bold">Lost to Inefficiency</td><td>-</td><td className="font-mono font-bold text-danger">+${Math.round(results.efficiencyPenaltyAmount).toLocaleString()}</td></tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="ai-agent-card">
              <div className="ai-header-wrapper">
                <div className="ai-icon-box"><BrainCircuit size={40} color="#818cf8" /></div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e0e7ff', marginBottom: '0.5rem' }}>AI Growth Agent Insights</h3>
                  <p style={{ color: '#a5b4fc', fontSize: '0.95rem' }}>
                    Based on your industry ({inputs.industry}) and current metric profile, here are 3 tailored strategies:
                  </p>
                  <div className="ai-recommendation-grid">
                    <AnimatePresence mode="popLayout">
                      {results.recommendations.map((rec, i) => (
                        <motion.div key={i + inputs.industry} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }} className="ai-rec-item">
                          <div className="ai-rec-title">Strategy {i + 1}</div>
                          <p className="ai-rec-desc">{rec}</p>
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
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavHeader />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Routes>
    </BrowserRouter>
  );
}
