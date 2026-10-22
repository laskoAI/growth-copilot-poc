"use client";
import { useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import TopBar from "@/components/TopBar";
import ChatWindow from "@/components/Chat/ChatWindow";
import PanelHost from "@/components/Panels/PanelHost";
import { useStore } from "@/lib/store";
import { getScript, PanelAction } from "@/lib/demoScript";
import { getFacilities, applyFilters, Filters } from "@/lib/fakeData";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function Home() {
  const runningRef = useRef(false);

  const applyAction = useCallback((a: PanelAction) => {
    const s = useStore.getState();
    switch (a.type) {
      case "setPanel":
        s.setPanel(a.panel);
        break;
      case "applyFilter": {
        const next: Filters = { ...s.filters, [a.key]: a.value } as Filters;
        s.setFilters(next);
        const count = applyFilters(getFacilities(), next).length;
        s.setSegmentCount(count);
        break;
      }
      case "selectCreative":
        s.setSelectedCreative(a.id);
        break;
      case "setSplit":
        s.setSplit(a.email, a.sms, a.share);
        break;
      case "launch":
        s.setLaunched(true);
        setTimeout(() => {
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        }, 400);
        break;
      case "advanceWeek":
        s.setWeekAdvanced(true);
        break;
      case "acceptBase":
        s.setBaseAccepted(true);
        break;
    }
  }, []);

  const runStep = useCallback(
    async (idx: number, userText?: string) => {
      if (runningRef.current) return;
      const s = useStore.getState();
      const script = getScript(s.flow);
      const step = script[idx];

      // Free-chat fallback: nie ma już kroków, ale user pisze dalej
      if (!step) {
        if (!userText) return;
        runningRef.current = true;
        s.addMessage({ id: uid(), role: "user", text: userText });
        s.setTyping(true);
        await new Promise((r) => setTimeout(r, 900));
        s.setTyping(false);
        s.addMessage({
          id: uid(),
          role: "ai",
          text: "Zanotowane. W pełnej wersji Growth Marketer AI mogę przejść do kolejnej kampanii, przygotować raport w PDF, wygenerować nowe kreacje pod inny segment albo podpiąć się pod inne systemy niż HubSpot. Powiedz, na czym Ci teraz najbardziej zależy — albo wciśnij „Restart”, żeby przejść demo od nowa.",
        });
        runningRef.current = false;
        return;
      }

      runningRef.current = true;
      s.addMessage({ id: uid(), role: "user", text: userText || step.quickReply });
      s.setTyping(true);

      await new Promise((r) => setTimeout(r, step.aiTypingMs ?? 900));

      s.setTyping(false);
      s.addMessage({ id: uid(), role: "ai", text: step.aiMessage });

      step.actions?.forEach(applyAction);

      if (step.timeline) {
        for (const t of step.timeline) {
          setTimeout(() => applyAction(t.action), t.delayMs);
        }
      }

      s.setStep(idx + 1);
      runningRef.current = false;
    },
    [applyAction]
  );

  const restart = useCallback(() => {
    useStore.getState().reset();
  }, []);

  const advance = useCallback(() => {
    const s = useStore.getState();
    const script = getScript(s.flow);
    if (s.stepIndex < script.length) {
      runStep(s.stepIndex);
    }
  }, [runStep]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if (e.key.toLowerCase() === "r") restart();
      if (e.key === "ArrowRight") advance();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [restart, advance]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar onRestart={restart} onAdvance={advance} />
      <div className="flex-1 min-h-0 grid grid-cols-[minmax(460px,50%)_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden">
        <ChatWindow onRunStep={runStep} />
        <PanelHost />
      </div>
    </div>
  );
}
