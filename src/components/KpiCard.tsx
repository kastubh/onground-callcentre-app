import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { Badge, Card } from './ui';
export default function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
  tone: string;
}) {
  return (
    <Card className="kpi">
      <div className="kpi-top">
        <span>{label}</span>
        <span className={`metric-icon ${tone}`}>
          <Icon size={16} />
        </span>
      </div>
      <div className="kpi-value">
        {value}
        <Badge>
          <ArrowUpRight size={11} />
          {delta}
        </Badge>
      </div>
      <small className="muted">vs. previous shift</small>
    </Card>
  );
}
