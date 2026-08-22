import './BudgetSummary.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { DollarSign, AlertTriangle } from 'lucide-react';

const COLORS = ['#1E88E5', '#FFB300', '#43A047', '#E53935', '#9C27B0', '#FF5722', '#00BCD4', '#795548'];

export default function BudgetSummary({ trip, compact = false }) {
  const stops = trip.stops || [];
  const totalBudget = trip.totalBudget || 0;

  const stopBudgets = stops.map((stop) => ({
    name: stop.city,
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
        <h3 className="budget-title"><DollarSign size={18} /> Budget Summary</h3>
        <div className="budget-total">
          <span>${totalBudget.toLocaleString()}</span>
          <small>total</small>
        </div>
        <div className="budget-perday">
          <span className="budget-perday-val">${perDay}</span>
          <span className="budget-perday-label">/day avg</span>
        </div>
        <hr className="divider" />
        {stopBudgets.map((s, i) => (
          <div key={i} className="budget-stop-row">
            <span>{s.name}</span>
            <span>${s.budget.toLocaleString()}</span>
          </div>
        ))}
        {categoryData.length > 0 && (
          <div style={{ marginTop: '1rem', height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={65} label={({ name }) => name}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `$${v}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="budget-page">
      <div className="budget-stats-row">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(30,136,229,0.15)', color: 'var(--primary)' }}><DollarSign size={20} /></div>
          <div className="stat-number">${totalBudget.toLocaleString()}</div>
          <div className="stat-label">Total Budget</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255,179,0,0.15)', color: 'var(--accent)' }}><DollarSign size={20} /></div>
          <div className="stat-number">${perDay}</div>
          <div className="stat-label">Per Day</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(67,160,71,0.15)', color: 'var(--success)' }}><DollarSign size={20} /></div>
          <div className="stat-number">{days}</div>
          <div className="stat-label">Days</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(156,39,176,0.15)', color: '#9C27B0' }}><DollarSign size={20} /></div>
          <div className="stat-number">{stops.reduce((s, stop) => s + (stop.activities?.length || 0), 0)}</div>
          <div className="stat-label">Activities</div>
        </div>
      </div>

      <div className="budget-charts-row">
        {/* Pie chart */}
        {categoryData.length > 0 && (
          <div className="budget-chart-card glass-card">
            <h3>Spending by Category</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`$${v}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bar chart */}
        {stopBudgets.length > 0 && (
          <div className="budget-chart-card glass-card">
            <h3>Budget by Stop</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stopBudgets} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} tickFormatter={v => `$${v}`} />
                <Tooltip formatter={v => [`$${v}`, 'Budget']} contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Bar dataKey="budget" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Stop breakdown table */}
      {stopBudgets.length > 0 && (
        <div className="budget-breakdown glass-card">
          <h3>Stop Breakdown</h3>
          <table className="budget-table">
            <thead>
              <tr><th>Stop</th><th>Activities</th><th>Budget</th><th>% of Total</th></tr>
            </thead>
            <tbody>
              {stops.map((stop, i) => {
                const bud = stopBudgets[i]?.budget || 0;
                const pct = totalBudget > 0 ? ((bud / totalBudget) * 100).toFixed(1) : 0;
                return (
                  <tr key={stop._id}>
                    <td>{stop.city}</td>
                    <td>{stop.activities?.length || 0}</td>
                    <td>${bud.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="progress-bar" style={{ flex: 1, height: 4 }}>
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{pct}%</span>
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
