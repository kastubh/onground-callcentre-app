import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Hash,
  Pin,
  Check,
  CalendarClock,
  Send,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { Badge } from '../components/ui';
import ChatBubble from '../components/ChatBubble';
import { channels, teamMessages } from '../data/mock';
import { useLocalState } from '../hooks/useLocalState';
import { currentTime } from '../lib/format';
import type { Message } from '../types';
export default function Channel() {
  const { channelId = 'callcentre-team' } = useParams();
  return <Conversation key={channelId} channelId={channelId} />;
}
function Conversation({ channelId }: { channelId: string }) {
  const isTeam = channelId === 'callcentre-team';
  const isBot = channelId === 'avanibot';
  const channel = channels.find((item) => item.id === channelId);
  const initial: Message[] = isTeam
    ? teamMessages
    : [
        {
          id: 'welcome',
          name: isBot ? 'AvaniBot' : 'Sunita Rao',
          time: '12:00 pm',
          text: isBot
            ? 'Hello Arvind! Ask about your plan, financing, warranty, or callbacks. This is a local demo assistant with prepared guidance.'
            : `Welcome to #${channel?.name ?? channelId}. Share questions, insights, and customer updates with your team.`,
        },
      ];
  const [messages, setMessages] = useLocalState<Message[]>(
    `onground:messages:${channelId}`,
    initial,
  );
  const [resolved, setResolved] = useLocalState(`onground:resolved:${channelId}`, false);
  const [draft, setDraft] = useState('');
  const [reply, setReply] = useState('');
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, resolved]);
  function post(text: string) {
    if (!text.trim()) return;
    const newMessage: Message = {
      id: crypto.randomUUID(),
      name: 'Arvind Rajan',
      time: currentTime(),
      text: text.trim(),
      own: true,
    };
    const botMessage: Message = {
      id: crypto.randomUUID(),
      name: 'AvaniBot',
      time: currentTime(),
      text: /emi|financ/i.test(text)
        ? 'Financing: confirm the customer’s preferred tenure, share the current quote, and explain that eligibility and final EMI terms require the financing partner’s approval.'
        : /warranty|trial/i.test(text)
          ? 'For warranty or trial questions, check the product-specific policy before promising coverage. Use the SOP channel to review the agreed terms with your customer.'
          : 'Your next steps: follow up with Mukunda, reconnect with the 5 missed callers, and confirm Priya’s 4:30 pm callback. Open Plan to begin.',
    };
    setMessages((previous) => [...previous, newMessage, ...(isBot ? [botMessage] : [])]);
  }
  function resolve(text: string) {
    post(text);
    setResolved(true);
    setReply('');
  }
  return (
    <section className="conversation">
      <header className="conversation-heading">
        <Link to="/pulse" className="icon-button" aria-label="Back to Pulse">
          <ArrowLeft size={19} />
        </Link>
        <span className="channel-icon role">
          {isBot ? <Sparkles size={21} /> : <Hash size={21} />}
        </span>
        <div className="grow">
          <h1>{isBot ? 'AvaniBot' : `#${channelId}`}</h1>
          <p>
            {channel?.description ?? 'Your daily companion'} · {isTeam ? '8 members' : 'Connected'}
          </p>
        </div>
        <Badge tone="purple">
          <span className="live-dot" />
          Pulse
        </Badge>
      </header>
      <div className="conversation-scroll">
        {isTeam && !resolved && (
          <section className="input-card">
            <div className="input-card-heading">
              <Badge tone="amber">
                <Pin size={11} />
                Needs your input
              </Badge>
              <span className="muted">Pinned by Sunita Rao</span>
            </div>
            <h2>Confirm the 4:30pm callback</h2>
            <p>
              Priya Iyer is ready to discuss EMI options for SmartGRID Luxe. Can you take the
              callback?
            </p>
            <div className="input-actions">
              <button
                className="button primary"
                onClick={() => resolve('Confirmed — I’ll take Priya Iyer’s 4:30 pm callback.')}
              >
                <Check size={14} />
                Confirmed
              </button>
              <button
                className="button outline"
                onClick={() =>
                  resolve(
                    'Please reschedule Priya Iyer’s callback. I’ll coordinate a new time with the team.',
                  )
                }
              >
                <CalendarClock size={14} />
                Reschedule
              </button>
            </div>
            <form
              className="reply-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (reply.trim()) resolve(reply);
              }}
            >
              <MessageSquare size={14} />
              <input
                placeholder="Or add a reply…"
                aria-label="Reply to pinned request"
                value={reply}
                onChange={(event) => setReply(event.target.value)}
              />
              <button className="icon-button" disabled={!reply.trim()} aria-label="Submit reply">
                <Send size={15} />
              </button>
            </form>
          </section>
        )}
        {isTeam && resolved && (
          <div className="resolved-note">
            <Check size={14} />
            Callback request answered. Your response is in the conversation.
          </div>
        )}
        <div className="day-divider">Today</div>
        <div aria-live="polite" aria-relevant="additions">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
        </div>
        <div ref={end} />
      </div>
      <form
        className="message-form"
        onSubmit={(event) => {
          event.preventDefault();
          post(draft);
          setDraft('');
        }}
      >
        <input
          aria-label="Message"
          placeholder={isBot ? 'Ask AvaniBot a question…' : `Message #${channelId}…`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <span className="muted">Enter to send</span>
        <button className="send-button" disabled={!draft.trim()} aria-label="Send message">
          <Send size={17} />
        </button>
      </form>
    </section>
  );
}
