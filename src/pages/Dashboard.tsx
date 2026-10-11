import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  ShieldCheck,
  Clock3,
  IndianRupee,
  Users,
  ArrowRight,
  Phone,
  Flame,
  ClipboardCheck,
  Sparkles,
  Target,
  CalendarDays,
} from 'lucide-react';
import { Badge, Card } from '../components/ui';
import KpiCard from '../components/KpiCard';
import LeadsModal from '../components/LeadsModal';
import { progress, week } from '../data/mock';
import { currency, todayInIndia } from '../lib/format';
function TrendChart({ cash = false }: { cash?: boolean }) {
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={week} margin={{ top: 12, right: 4, bottom: 0, left: -24 }}>
          <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#eeedf2" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#858895' }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#858895' }}
            tickFormatter={(value: number) => (cash ? `${value / 1000}k` : String(value))}
          />
          <Tooltip
            cursor={{ fill: '#f5f6f8' }}
            formatter={(value) => (cash ? currency(Number(value ?? 0)) : String(value ?? 0))}
            contentStyle={{ borderRadius: 10, fontSize: 12, border: '1px solid #eee' }}
          />
          <Bar
            dataKey={cash ? 'cash' : 'calls'}
            name={cash ? 'Cash' : 'Calls'}
            radius={[5, 5, 0, 0]}
            maxBarSize={30}
          >
            {week.map((day, index) => (
              <Cell
                key={day.day}
                fill={index === 6 ? (cash ? '#d7a649' : '#2e6b56') : cash ? '#f2e5c8' : '#d9e7df'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export default function Dashboard() {
  const [leadOpen, setLeadOpen] = useState(false);
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">YOUR DAILY OVERVIEW</div>
          <h1>Dashboard</h1>
        </div>
        <span className="date-label">
          <CalendarDays size={14} />
          {todayInIndia().toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>
      <section className="hero">
        <div>
          <span className="hero-kicker">
            <span className="live-dot" />
            LET’S MAKE TODAY COUNT
          </span>
          <h2>
            Good afternoon, Arvind Rajan <span className="wave">☀</span>
          </h2>
          <p>A fresh conversation. A better night’s sleep. You make it happen.</p>
          <Link className="hero-button" to="/plan/calls">
            View my calling plan <ArrowRight size={15} />
          </Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="art-phone">
            <Phone size={30} />
            <span className="sound-bars">▂ ▅ ▇ ▄ ▆ ▂</span>
          </div>
          <div className="art-spark">
            <Sparkles size={21} />
          </div>
        </div>
      </section>
      <div className="kpi-grid">
        <KpiCard label="QA score" value="76" delta="4 pts" icon={ShieldCheck} tone="purple" />
        <KpiCard
          label="Avg handle time"
          value="4m 12s"
          delta="18s faster"
          icon={Clock3}
          tone="blue"
        />
        <KpiCard label="Cash / Conversion" value="34%" delta="6%" icon={IndianRupee} tone="amber" />
        <KpiCard label="In queue" value="2" delta="Ready for you" icon={Users} tone="green" />
      </div>
      <div className="dashboard-middle">
        <Card>
          <div className="card-heading">
            <h2>
              My progress <span className="muted font-normal">— today</span>
            </h2>
            <Target size={16} className="muted" />
          </div>
          <div className="progress-row">
            <div>
              <span>Leads handled</span>
              <strong>
                {progress.handled}
                <small> / {progress.handledTarget}</small>
              </strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${(progress.handled / progress.handledTarget) * 100}%` }} />
            </div>
          </div>
          <div className="progress-row">
            <div>
              <span>Leads called</span>
              <strong>
                {progress.called}
                <small> / {progress.calledTarget}</small>
              </strong>
            </div>
            <div className="progress-track gold">
              <span style={{ width: `${(progress.called / progress.calledTarget) * 100}%` }} />
            </div>
          </div>
          <div className="card-note">
            <span className="live-dot" />
            You’re on track. Keep the momentum going!
          </div>
        </Card>
        <Card>
          <div className="card-heading">
            <h2>Who’s waiting</h2>
            <Badge tone="neutral">2 in queue</Badge>
          </div>
          {[
            { name: 'Priya Iyer', initials: 'PI', product: 'SmartGRID Luxe', wait: '2m 14s' },
            { name: 'Suresh Nair', initials: 'SN', product: 'Elev8 Recliner', wait: '1m 08s' },
          ].map((person) => (
            <Link to="/plan/incoming" className="waiting-row" key={person.name}>
              <span className="avatar pastel">{person.initials}</span>
              <div>
                <strong>{person.name}</strong>
                <small>{person.product}</small>
              </div>
              <Badge tone="amber">
                <Clock3 size={10} />
                {person.wait}
              </Badge>
            </Link>
          ))}
          <Link className="text-link" to="/plan/incoming">
            View incoming calls <ArrowRight size={13} />
          </Link>
        </Card>
        <Card className="earnings-card">
          <div className="card-heading">
            <h2>My earnings this month</h2>
            <span className="metric-icon amber">
              <IndianRupee size={15} />
            </span>
          </div>
          <div className="earnings-value">
            {currency(progress.earnings)}
            <Badge>+12%</Badge>
          </div>
          <p className="muted">A little closer to your next milestone.</p>
          <div className="progress-track gold">
            <span style={{ width: `${(progress.earnings / progress.earningsTarget) * 100}%` }} />
          </div>
          <div className="earnings-target">
            <span>
              {Math.round((progress.earnings / progress.earningsTarget) * 100)}% of target
            </span>
            <strong>{currency(progress.earningsTarget)}</strong>
          </div>
        </Card>
      </div>
      <Card className="tasks-card">
        <div className="task-intro">
          <h2>My Tasks</h2>
          <p className="muted">Your next best actions</p>
        </div>
        {[
          { label: '2 callbacks', text: 'Pick up where you left off', icon: Phone, tone: 'purple' },
          {
            label: '2 hot leads',
            text: 'A little nudge goes a long way',
            icon: Flame,
            tone: 'amber',
          },
          {
            label: '1 outcome',
            text: 'Close the loop on your last call',
            icon: ClipboardCheck,
            tone: 'green',
          },
        ].map(({ label, text, icon: Icon, tone }) => (
          <button className="dashboard-task" onClick={() => setLeadOpen(true)} key={label}>
            <span className={`metric-icon ${tone}`}>
              <Icon size={17} />
            </span>
            <div>
              <strong>{label}</strong>
              <small>{text}</small>
            </div>
            <ArrowRight size={15} className="muted" />
          </button>
        ))}
      </Card>
      <div className="chart-grid">
        <Card>
          <div className="card-heading">
            <div>
              <h2>
                Calls handled <span className="muted font-normal">— last 7 days</span>
              </h2>
              <p className="chart-subtitle">
                <strong>{week.reduce((sum, d) => sum + d.calls, 0)}</strong> total calls{' '}
                <span className="positive">↗ 14% this week</span>
              </p>
            </div>
            <span className="chart-legend">
              <i />
              Calls
            </span>
          </div>
          <TrendChart />
        </Card>
        <Card>
          <div className="card-heading">
            <div>
              <h2>
                Cash trend <span className="muted font-normal">— last 7 days</span>
              </h2>
              <p className="chart-subtitle">
                <strong>{currency(week.reduce((sum, d) => sum + d.cash, 0))}</strong> total value{' '}
                <span className="positive">↗ 18% this week</span>
              </p>
            </div>
            <span className="chart-legend gold">
              <i />
              Cash
            </span>
          </div>
          <TrendChart cash />
        </Card>
      </div>
      {leadOpen && <LeadsModal onClose={() => setLeadOpen(false)} />}
    </>
  );
}
