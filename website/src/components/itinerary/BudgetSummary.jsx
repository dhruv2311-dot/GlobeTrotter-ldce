import React from 'react';
import './BudgetSummary.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { DollarSign, PieChart as PieIcon, BarChart2 } from 'lucide-react';

const COLORS = ['#714B67', '#017E84', '#10B981', '#017E84', '#714B67', '#714B67', '#017E84', '#714B67'];

export default function BudgetSummary({ trip, compact = false }) {
  const stops = trip.stops || [];
  const totalBudget = trip.totalBudget || 0;

  const stopBudgets = stops.map((stop) => ({
    name: stop.city?.name || stop.city,
    budget: stop.sectionBudget || stop.activities?.reduce((s, a) => s + (a.cost || 0), 0) || 0,
  }));

  const categoryData = stops.flatMap(s => s.activities || []).reduce((acc, act) => {
    const existing = acc.find(a => a.name === act.category);
    if (existing) existing.value += act.cost || 0;
    else acc.push({ name: act.category, value: act.cost || 0 });
    return acc;
  }, []);

  const days = trip.startDate && trip.endDate
    ? Math.max(1, Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)))
    : 1;
  const perDay = (totalBudget / days).toFixed(0);

  if (compact) {
    return (
      <div className="budget-summary-compact glass-card">
        <h3 className="budget-title"><DollarSign size={18} color="#714B67" /> Budget Breakdown</h3>
        
        <div className="budget-total-box">
          <span className="total-amount">${totalBudget.toLocaleString()}</span>
          <span className="total-lbl">Total Estimated Cost</span>
        </div>

        <div className="budget-perday-box">
          <span className="budget-perday-val">${perDay}</span>
          <span className="budget-perday-label">Daily Avg Expenses</span>
        </div>

        <hr className="budget-divider" />

        <div className="budget-stops-mini">
          {stopBudgets.map((s, i) => (
            <div key={i} className="budget-stop-row">
              <span className="stop-name-mini">{s.name}</span>
              <span className="stop-budget-mini">${s.budget.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {categoryData.length > 0 && (
          <div style={{ marginTop: '1.25rem', height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={60} label={({ name }) => name}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `$${v}`} contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '8px', color: '#212529' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="budget-page">
      <div className="budget-stats-grid">
        <div className="budget-stat-card glass-card">
          <div className="stat-icon-wrap cyan"><DollarSign size={22} /></div>
          <div>
            <div className="stat-number">${totalBudget.toLocaleString()}</div>
            <div className="stat-label">Total Estimated Budget</div>
          </div>
        </div>

        <div className="budget-stat-card glass-card">
          <div className="stat-icon-wrap amber"><DollarSign size={22} /></div>
          <div>
            <div className="stat-number">${perDay}</div>
            <div className="stat-label">Per Day Average</div>
          </div>
        </div>

        <div className="budget-stat-card glass-card">
          <div className="stat-icon-wrap emerald"><DollarSign size={22} /></div>
          <div>
            <div className="stat-number">{days} Days</div>
            <div className="stat-label">Trip Duration</div>
          </div>
        </div>

        <div className="budget-stat-card glass-card">
          <div className="stat-icon-wrap violet"><DollarSign size={22} /></div>
          <div>
            <div className="stat-number">{stops.reduce((s, stop) => s + (stop.activities?.length || 0), 0)}</div>
            <div className="stat-label">Planned Activities</div>
          </div>
        </div>
      </div>

      <div className="budget-charts-row">
        {/* Pie Chart */}
        {categoryData.length > 0 && (
          <div className="budget-chart-card glass-card">
            <h3><PieIcon size={18} color="#714B67" /> Expense Distribution by Category</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={95} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`$${v}`, 'Expenses']} contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '12px', color: '#212529' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bar Chart */}
        {stopBudgets.length > 0 && (
          <div className="budget-chart-card glass-card">
            <h3><BarChart2 size={18} color="#714B67" /> Expenses by Destination Stop</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stopBudgets} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#6C757D" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6C757D" tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                <Tooltip formatter={v => [`$${v}`, 'Budget']} contentStyle={{ background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '12px', color: '#212529' }} />
                <Bar dataKey="budget" fill="#714B67" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Stop Breakdown Table */}
      {stopBudgets.length > 0 && (
        <div className="budget-breakdown glass-card" style={{ marginTop: '2rem' }}>
          <h3 className="section-title">City & Stop Budget Summary</h3>
          <table className="budget-table">
            <thead>
              <tr><th>Destination Stop</th><th>Activities</th><th>Subtotal</th><th>Share of Total</th></tr>
            </thead>
            <tbody>
              {stops.map((stop, i) => {
                const bud = stopBudgets[i]?.budget || 0;
                const pct = totalBudget > 0 ? ((bud / totalBudget) * 100).toFixed(1) : 0;
                return (
                  <tr key={stop._id || stop.id}>
                    <td style={{ fontWeight: 700, color: '#212529' }}>{stop.city?.name || stop.city}</td>
                    <td>{stop.activities?.length || 0}</td>
                    <td style={{ color: '#10B981', fontWeight: 800, fontFamily: 'Outfit' }}>${bud.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="progress-bar-bg" style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--grad-cyan-blue)', borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#495057', fontWeight: 600 }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
