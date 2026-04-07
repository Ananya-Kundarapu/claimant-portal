import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const AIHelpBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your AI Claims Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef();

  // ✅ Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ MAIN SEND FUNCTION (FIXED)
  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', text: input };

    // Add user message
    setMessages((m) => [...m, userMsg]);

    const currentInput = input; // store before clearing
    setInput('');
    setLoading(true);

    // Add typing indicator
    setMessages((m) => [...m, { role: 'bot', text: 'Typing...' }]);

    try {
      const res = await fetch('/api/ai/help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          message: currentInput,
          history: messages,
        }),
      });

      const data = await res.json();

      // Replace typing with actual response
      setMessages((m) => {
        const updated = [...m];
        updated.pop(); // remove typing
        return [
          ...updated,
          {
            role: 'bot',
            text: data.reply || 'No response',
          },
        ];
      });

    } catch (err) {
      console.error(err);

      setMessages((m) => {
        const updated = [...m];
        updated.pop();
        return [
          ...updated,
          {
            role: 'bot',
            text: 'Something went wrong. Try again.',
          },
        ];
      });
    }

    setLoading(false);
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-50"
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div
          className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white border rounded-xl shadow-xl z-50 flex flex-col overflow-hidden"
          style={{ height: '420px' }}
        >
          {/* HEADER */}
          <div className="px-4 py-3 border-b bg-blue-600">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-white" />
              <div>
                <p className="font-semibold text-sm text-white">AI Help Bot</p>
                <p className="text-xs text-white/80">Claims assistance</p>
              </div>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text === 'Typing...' ? (
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}

            {/* Auto scroll target */}
            <div ref={bottomRef}></div>
          </div>

          {/* INPUT */}
          <div className="p-3 border-t flex gap-2">
            <input
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              className="flex-1 border rounded-md px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={send}
              disabled={loading}
              className="bg-blue-600 text-white px-3 rounded-md disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIHelpBot;