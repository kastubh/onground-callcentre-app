import { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Info } from 'lucide-react';
import { Card, Badge, PageTitle } from '../components/ui';
import { calendarEvents } from '../data/mock';
import { todayInIndia } from '../lib/format';
export default function Calendar() {
  const today = todayInIndia();
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const [selected, setSelected] = useState(new Date(2026, 9, 11));
  const offset = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cellCount = Math.ceil((offset + count) / 7) * 7;
  const events = month.getFullYear() === 2026 && month.getMonth() === 9 ? calendarEvents : [];
  const selectedEvents = events.filter((event) => event.day === selected.getDate());
  function move(direction: number) {
    const next = new Date(month.getFullYear(), month.getMonth() + direction, 1);
    setMonth(next);
    setSelected(next);
  }
  return (
    <>
      <PageTitle
        eyebrow="A LITTLE PLANNING GOES A LONG WAY"
        title="Calendar"
        subtitle="Make space for follow-ups, learning, and your next win."
      />
      <div className="info-banner">
        <Info size={18} />
        <div>
          <strong>Your day, thoughtfully organised.</strong>
          <p>Callbacks and team sessions live here. Select a date to see what’s coming up.</p>
        </div>
      </div>
      <div className="calendar-layout">
        <Card className="calendar-card">
          <div className="calendar-heading">
            <h2>{month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h2>
            <div>
              <button
                className="button outline"
                onClick={() => {
                  setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                  setSelected(today);
                }}
              >
                Today
              </button>
              <button className="icon-button" aria-label="Previous month" onClick={() => move(-1)}>
                <ChevronLeft size={17} />
              </button>
              <button className="icon-button" aria-label="Next month" onClick={() => move(1)}>
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
          <div className="calendar-grid weekdays">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {Array.from({ length: cellCount }, (_, index) => {
              const date = new Date(month.getFullYear(), month.getMonth(), index - offset + 1);
              const inMonth = date.getMonth() === month.getMonth();
              const isToday = date.toDateString() === today.toDateString();
              const isSelected = date.toDateString() === selected.toDateString();
              const dayEvents = inMonth
                ? events.filter((event) => event.day === date.getDate())
                : [];
              return (
                <button
                  key={index}
                  className={`calendar-cell ${!inMonth ? 'outside' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  aria-label={`${date.toDateString()}${isToday ? ', today' : ''}${dayEvents.length ? `, ${dayEvents.length} event` : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelected(date);
                    if (!inMonth) setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                  }}
                >
                  <span className="day-number">{date.getDate()}</span>
                  {isToday && <span className="today-label">Today</span>}
                  {dayEvents.map((event) => (
                    <span className="calendar-event" key={event.title}>
                      <i />
                      {event.title}
                    </span>
                  ))}
                </button>
              );
            })}
          </div>
          <div className="calendar-key">
            <span>
              <i className="event-dot" />
              Scheduled event
            </span>
            <span>
              <i className="today-dot" />
              Today
            </span>
            <small>All times in India Standard Time</small>
          </div>
        </Card>
        <Card className="agenda">
          <span className="metric-icon purple">
            <CalendarDays size={17} />
          </span>
          <h2>
            {selected.toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'short',
            })}
          </h2>
          <p className="muted">Your agenda</p>
          {selectedEvents.length ? (
            selectedEvents.map((event) => (
              <div className="agenda-event" key={event.title}>
                <Badge tone="purple">
                  <Clock3 size={11} />
                  {event.time}
                </Badge>
                <h3>{event.title}</h3>
                <p className="muted">The Sleep Company · Agent workspace</p>
              </div>
            ))
          ) : (
            <div className="agenda-empty">
              <CalendarDays size={27} />
              <strong>A little breathing room.</strong>
              <p>No events scheduled for this date.</p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
