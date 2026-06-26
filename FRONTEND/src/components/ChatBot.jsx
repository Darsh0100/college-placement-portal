import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, User, Send, X, MessageCircle } from "lucide-react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hi! I am your Placement AI Assistant.\n\nAsk me anything about placements, companies or jobs.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;

    const question = input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: question,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://placement-rag-service-6vus.onrender.com/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.answer,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "❌ Unable to connect to AI server.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 `z-[9999]` h-16 w-16  rounded-full bg-blue-900 text-white shadow-2xl hover:scale-105 transition"
      >
        {open ? <X size={28} className="mx-auto " /> : <MessageCircle className="mx-auto" size={28} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 `z-[9999]` `w-[400px]` `h-[620px]` bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-blue-900 text-white p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white text-blue-900 flex items-center justify-center">
              <Bot size={26} />
            </div>

            <div>
              <h2 className="font-semibold">Placement AI</h2>

              <p className="text-xs opacity-80">Powered by Gemini</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-2 max-w-[90%] ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user"
                        ? "bg-blue-900 text-white"
                        : "bg-slate-300"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User size={18} />
                    ) : (
                      <Bot size={18} />
                    )}
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 shadow text-sm leading-6 ${
                      msg.role === "user"
                        ? "bg-blue-900 text-white"
                        : "bg-white"
                    }`}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-slate-300 flex items-center justify-center">
                  <Bot size={18} />
                </div>

                <div className="bg-white rounded-2xl px-4 py-3 shadow text-sm">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>

          <div className="border-t bg-white p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
                placeholder="Ask anything about placements..."
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
              />

              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-blue-900 text-white rounded-xl px-5 hover:bg-blue-800 transition disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setInput("Show me React jobs")}
                className="text-xs px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200"
              >
                React Jobs
              </button>

              <button
                onClick={() => setInput("Recommend jobs for me")}
                className="text-xs px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200"
              >
                Recommend Jobs
              </button>

              <button
                onClick={() => setInput("Highest paying jobs")}
                className="text-xs px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200"
              >
                Highest Salary
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
