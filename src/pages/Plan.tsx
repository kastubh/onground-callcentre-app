import { useState } from 'react';
import { NavLink, Navigate, useParams } from 'react-router-dom';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  Phone,
  Search,
  Headphones,
  Sparkles,
} from 'lucide-react';
import { Card, Badge, PageTitle, Pagination } from '../components/ui';
import Modal from '../components/Modal';
import CallModal from '../components/CallModal';
import { leads, missedCalls, recentCalls } from '../data/mock';
import { currency } from '../lib/format';
import type { RecentCall } from '../types';
export default function Plan() {
  const { tab } = useParams();
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [calling, setCalling] = useState<string | null>(null);
  const [review, setReview] = useState<RecentCall | null>(null);
  const filtered = [...leads]
    .filter((lead) => `${lead.name} ${lead.product}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.score - a.score);
  if (!['calls', 'incoming', 'recent', 'practise'].includes(tab ?? ''))
    return <Navigate to="/plan/calls" replace />;
  return (
    <>
      <PageTitle
        eyebrow="MAKE EVERY CONVERSATION COUNT"
        title="Today’s calling plan"
        subtitle="The right people. The right context. Your next best call."
        action={<Badge tone="neutral">Planner</Badge>}
      />
      <div className="page-tabs">
        {[
          { id: 'calls', label: 'Calls to make', count: leads.length },
          { id: 'incoming', label: 'Incoming', count: missedCalls.length },
          { id: 'recent', label: 'Recent' },
          { id: 'practise', label: 'Practise a call' },
        ].map((item) => (
          <NavLink
            key={item.id}
            to={`/plan/${item.id}`}
            onClick={() => {
              setSearch('');
              setPage(0);
            }}
          >
            {item.label}
            {item.count && <span>{item.count}</span>}
          </NavLink>
        ))}
      </div>
      {tab === 'calls' && (
        <Card className="list-card">
          <div className="list-heading">
            <div>
              <h2>Planned outgoing calls</h2>
              <p className="muted">Ranked by fit and intent, so you know where to begin.</p>
            </div>
            <label className="search-field">
              <Search size={15} />
              <input
                aria-label="Search leads"
                placeholder="Search leads…"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(0);
                }}
              />
            </label>
          </div>
          <div className="table-labels">
            <span>LEAD / PRODUCT INTEREST</span>
            <span>ICP SCORE</span>
            <span>EXPECTED VALUE</span>
            <span />
          </div>
          {filtered.slice(page * 5, page * 5 + 5).map((lead, index) => (
            <div className="lead-row-wrap" key={lead.id}>
              <button
                className="lead-row"
                aria-expanded={expanded === lead.id}
                onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
              >
                <div className="lead-name">
                  <span className="rank">{page * 5 + index + 1}</span>
                  <span className="avatar pastel">{lead.initials}</span>
                  <div>
                    <strong>{lead.name}</strong>
                    <small>{lead.product}</small>
                  </div>
                </div>
                <span>
                  <Badge tone={lead.score >= 80 ? 'green' : 'amber'}>{lead.score}%</Badge>
                </span>
                <strong>{currency(lead.value)}</strong>
                <ChevronDown size={16} className={expanded === lead.id ? 'rotated' : ''} />
              </button>
              {expanded === lead.id && (
                <div className="lead-expanded">
                  <div>
                    <strong>Ready for a thoughtful follow-up</strong>
                    <p>
                      {lead.source} · {lead.intent}% intent · {lead.hours} hours to close
                    </p>
                    <p>
                      Ask about comfort preferences, explain financing, and share a personalised
                      quote.
                    </p>
                  </div>
                  <button className="button primary" onClick={() => setCalling(lead.name)}>
                    <Phone size={14} />
                    Call now
                  </button>
                </div>
              )}
            </div>
          ))}
          {!filtered.length && (
            <div className="empty-state">
              No leads match “{search}”. Try a different name or product.
            </div>
          )}
          {filtered.length > 0 && (
            <Pagination page={page} total={Math.ceil(filtered.length / 5)} onChange={setPage} />
          )}
        </Card>
      )}
      {tab === 'incoming' && (
        <>
          <div className="info-banner amber-banner">
            <Phone size={18} />
            <div>
              <strong>{missedCalls.length} missed calls. A chance to reconnect.</strong>
              <p>
                {currency(missedCalls.reduce((total, call) => total + call.value, 0))} in total
                expected value · Prioritise the warmest leads first.
              </p>
            </div>
          </div>
          <Card className="list-card">
            <div className="list-heading">
              <h2>Missed incoming calls</h2>
              <Badge tone="red">{missedCalls.length} need attention</Badge>
            </div>
            {missedCalls.map((call) => (
              <div className="incoming-row" key={call.id}>
                <span className="call-icon missed">
                  <ArrowDownLeft size={18} />
                </span>
                <div className="grow">
                  <strong>{call.name}</strong>
                  <small>Missed at {call.time}</small>
                </div>
                <div className={`call-value ${call.hot ? 'positive' : 'negative'}`}>
                  <strong>{call.value ? currency(call.value) : 'Not available'}</strong>
                  <small>Expected value</small>
                </div>
                <button className="button outline" onClick={() => setCalling(call.name)}>
                  <Phone size={13} />
                  Call back
                </button>
              </div>
            ))}
          </Card>
        </>
      )}
      {tab === 'recent' && (
        <Card className="list-card">
          <div className="list-heading">
            <div>
              <h2>Recent conversations</h2>
              <p className="muted">A little context for your next conversation.</p>
            </div>
            <Badge tone="neutral">Today</Badge>
          </div>
          {recentCalls.map((call) => (
            <button className="recent-row" key={call.id} onClick={() => setReview(call)}>
              <span className={`call-icon ${call.type}`}>
                {call.type === 'incoming' ? (
                  <ArrowDownLeft size={18} />
                ) : (
                  <ArrowUpRight size={18} />
                )}
              </span>
              <div className="grow">
                <strong>{call.name}</strong>
                <small>
                  {call.type} · {call.time}
                </small>
              </div>
              <Badge tone={call.outcome === 'Converted' ? 'green' : 'neutral'}>
                {call.outcome}
              </Badge>
              <span>{call.duration}</span>
              <ArrowUpRight size={15} />
            </button>
          ))}
        </Card>
      )}
      {tab === 'practise' && (
        <Card className="practice-card">
          <span className="practice-icon">
            <Headphones size={35} />
          </span>
          <Badge tone="purple">
            <Sparkles size={12} />A safe place to get better
          </Badge>
          <h2>Your next great call starts here.</h2>
          <p>
            Practise a conversation with a customer exploring the SmartGRID Luxe.
            <br />
            Build confidence with product questions, EMI options, and objections.
          </p>
          <div className="practice-topics">
            <span>Product discovery</span>
            <span>Objection handling</span>
            <span>Closing naturally</span>
          </div>
          <button className="button primary" onClick={() => setCalling('Practice customer')}>
            <Phone size={15} />
            Start a practice call
          </button>
          <small className="muted">Local simulation · no real phone call is placed</small>
        </Card>
      )}
      {calling && <CallModal name={calling} onClose={() => setCalling(null)} />}
      {review && (
        <Modal title="Conversation review" onClose={() => setReview(null)}>
          <div className="review-header">
            <span className="avatar large pastel">
              {review.name
                .split(' ')
                .map((word) => word[0])
                .join('')}
            </span>
            <h2>{review.name}</h2>
            <Badge>{review.outcome}</Badge>
          </div>
          <div className="breakdown">
            <span>
              Direction<strong>{review.type}</strong>
            </span>
            <span>
              Time<strong>{review.time}</strong>
            </span>
            <span>
              Duration<strong>{review.duration}</strong>
            </span>
          </div>
          <h3>Conversation notes</h3>
          <p>
            The customer discussed product comfort, delivery, and financing. Product details were
            shared and the next step was agreed.
          </p>
          <h3>Next best action</h3>
          <p>
            {review.outcome === 'Converted'
              ? 'Send an order confirmation and check delivery preferences.'
              : 'Follow up with the product quotation and answer any remaining questions.'}
          </p>
          <button
            className="button primary"
            onClick={() => {
              setCalling(review.name);
              setReview(null);
            }}
          >
            <Phone size={14} />
            Call again
          </button>
        </Modal>
      )}
    </>
  );
}
