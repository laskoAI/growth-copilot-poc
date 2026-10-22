"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useStore, ChatMessage } from "@/lib/store";
import { getScript } from "@/lib/demoScript";
import Logo from "@/components/Logo";

function AiAvatar({ size = 32 }: { size?: number }) {
  return <Logo size={size} />;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 h-5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-[var(--accent)]"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

function Bubble({ m }: { m: ChatMessage }) {
  const isUser = m.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && <AiAvatar />}
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-[15px] leading-7 whitespace-pre-wrap ${
          isUser
            ? "bg-gradient-to-br from-[var(--accent)] to-[#6a55ff] text-white rounded-tr-md shadow-[0_4px_14px_rgba(79,107,255,0.25)]"
            : "bg-white text-[var(--text)] border border-[var(--border)] rounded-tl-md shadow-[0_1px_3px_rgba(16,24,40,0.06)]"
        }`}
      >
        {m.text}
      </div>
      {isUser && (
        <div className="w-8 h-8 shrink-0 rounded-xl bg-[#eef0f6] border border-[var(--border)] flex items-center justify-center text-[11px] font-semibold text-[var(--muted)]">
          Ty
        </div>
      )}
    </motion.div>
  );
}

export default function ChatWindow({ onRunStep }: { onRunStep: (idx: number, userText?: string) => void }) {
  const { messages, isTyping, stepIndex, flow } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [input]);

  const nextStep = flow ? getScript(flow)[stepIndex] : undefined;

  function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    onRunStep(stepIndex, text);
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-gradient-to-b from-white to-[#f7f8fc] border-r border-[var(--border)]">
      <div className="px-8 py-5 border-b border-[var(--border)] bg-white/80 backdrop-blur flex items-center gap-3">
        <AiAvatar size={40} />
        <div className="flex-1">
          <div className="text-[15px] font-semibold">Growth Marketer AI</div>
          <div className="text-xs text-[var(--muted)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
            {isTyping ? "pisze…" : "online · gotowy do pracy"}
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-8 py-6 space-y-5">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <AiAvatar size={56} />
            <div className="mt-4 text-lg font-semibold">Cześć! W czym mogę pomóc?</div>
            <div className="mt-1.5 text-sm text-[var(--muted)] max-w-sm leading-6">
              {flow
                ? "Kliknij sugestię poniżej albo napisz własną wiadomość."
                : "Wybierz scenariusz po prawej stronie, żeby rozpocząć rozmowę."}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <Bubble key={m.id} m={m} />
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <AiAvatar />
            <div className="bg-white border border-[var(--border)] rounded-2xl rounded-tl-md px-5 py-4 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      <div className="px-8 pt-3 pb-6">
        <AnimatePresence>
          {nextStep && !isTyping && (
            <motion.button
              key={nextStep.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={() => onRunStep(stepIndex, nextStep.quickReply)}
              className="group w-full text-left text-sm leading-6 bg-[#f1f3ff] hover:bg-[#e7eaff] border border-[#d9defe] rounded-xl px-4 py-3 mb-3 text-[#2f3a8f]"
            >
              <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)] mr-2">
                ✦ Sugestia
              </span>
              {nextStep.quickReply}
            </motion.button>
          )}
        </AnimatePresence>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-end gap-2 bg-white border border-[var(--border)] rounded-2xl p-2 pl-4 shadow-[0_4px_20px_rgba(16,24,40,0.06)] focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_4px_rgba(79,107,255,0.12)]"
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Napisz do Growth Marketer AI…"
            className="flex-1 resize-none bg-transparent py-2 text-[15px] leading-6 outline-none placeholder:text-[#9ca3af]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90"
            aria-label="Wyślij"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
        <div className="mt-2 text-center text-[11px] text-[#9ca3af]">Enter — wyślij · Shift + Enter — nowa linia</div>
      </div>
    </div>
  );
}
