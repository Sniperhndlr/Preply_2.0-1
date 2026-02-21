import React, { useMemo, useState } from 'react';
import { ImagePlus, ShieldAlert } from 'lucide-react';
import { quickReplies } from '../data/marketplaceData';

const DEMO_CONVERSATIONS = [
  {
    id: 'c1',
    name: 'Avery Chen',
    subject: 'Algebra 1',
    messages: [
      { id: 'm1', sender: 'tutor', text: 'Hi! I can help with NC Math 8 standards this week.', at: '9:10 AM' },
      { id: 'm2', sender: 'student', text: 'Great, can we do Thursday after 4:30 PM?', at: '9:14 AM' },
    ],
  },
  {
    id: 'c2',
    name: 'Maya Thompson',
    subject: 'AP US History',
    messages: [
      { id: 'm3', sender: 'tutor', text: 'Please upload your DBQ draft and rubric.', at: 'Yesterday' },
    ],
  },
];

const MessagesPage = () => {
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS);
  const [activeId, setActiveId] = useState(DEMO_CONVERSATIONS[0].id);
  const [input, setInput] = useState('');

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId),
    [conversations, activeId],
  );

  const sendMessage = (text) => {
    const trimmed = String(text || '').trim();
    if (!trimmed) return;

    setConversations((prev) => prev.map((conversation) => {
      if (conversation.id !== activeId) return conversation;
      return {
        ...conversation,
        messages: [...conversation.messages, {
          id: `m${Date.now()}`,
          sender: 'student',
          text: trimmed,
          at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }],
      };
    }));
    setInput('');
  };

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-5">Messages</h1>

        <div className="grid md:grid-cols-[300px_1fr] gap-4">
          <aside className="glass-card rounded-2xl p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 px-2 pb-2">Conversations</p>
            <div className="space-y-1">
              {conversations.map((conversation) => {
                const latest = conversation.messages[conversation.messages.length - 1];
                const isActive = conversation.id === activeId;
                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setActiveId(conversation.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition ${
                      isActive
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40'
                        : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <p className="font-semibold text-slate-900 dark:text-white">{conversation.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{conversation.subject}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 truncate">{latest?.text}</p>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="glass-card rounded-2xl p-4 md:p-5 min-h-[560px] flex flex-col">
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 inline-flex items-center gap-2 mb-4 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-800">
              <ShieldAlert className="h-4 w-4" />
              For your safety, keep all communication and payments on SyllabusSync. Don&apos;t share personal contact details.
            </div>

            <header className="pb-3 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white">{activeConversation?.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{activeConversation?.subject}</p>
            </header>

            <div className="flex-1 py-4 space-y-3 overflow-y-auto">
              {activeConversation?.messages.map((message) => (
                <div key={message.id} className={`max-w-[78%] rounded-xl px-3 py-2 ${message.sender === 'student' ? 'ml-auto bg-cyan-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'}`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-[11px] mt-1 ${message.sender === 'student' ? 'text-cyan-100' : 'text-slate-500 dark:text-slate-400'}`}>{message.at}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap gap-2 mb-3">
                {quickReplies.map((reply) => (
                  <button key={reply} type="button" onClick={() => sendMessage(reply)} className="text-xs px-2.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-cyan-400">
                    {reply}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 inline-flex items-center justify-center text-slate-500 dark:text-slate-300" aria-label="Attach file">
                  <ImagePlus className="h-4 w-4" />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendMessage(input);
                  }}
                  className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm"
                  placeholder="Type a message..."
                />
                <button type="button" onClick={() => sendMessage(input)} className="btn-primary h-10 px-4 rounded-xl text-sm">Send</button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default MessagesPage;
