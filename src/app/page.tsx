"use client";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import TopBar from "@/components/TopBar";
import ChatWindow from "@/components/Chat/ChatWindow";
import PanelHost from "@/components/Panels/PanelHost";
import { useStore } from "@/lib/store";
import { getPanelForStep, getStageForStep } from "@/lib/demoScript";
import { goForward, goBack, restart, canGoForward, canGoBack } from "@/lib/nav";

export default function Home() {
  const stepIndex = useStore((s) => s.stepIndex);
  // Re-renderuje TopBar (cofnij/dalej), gdy zmienia się cokolwiek, od czego
  // zależą canGoForward()/canGoBack(), nie tylko stepIndex.
  useStore((s) => s.maxStepReached);
  useStore((s) => s.pendingStep);
  const panel = getPanelForStep(stepIndex);
  const stage = getStageForStep(stepIndex);
  const prevPanelRef = useRef(panel);

  useEffect(() => {
    if (prevPanelRef.current !== "sendResults" && panel === "sendResults") {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
    prevPanelRef.current = panel;
  }, [panel]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      if (e.key.toLowerCase() === "r") restart();
      if (e.key === "ArrowRight") goForward();
      if (e.key === "ArrowLeft") goBack();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar
        stage={stage}
        onBack={goBack}
        onForward={goForward}
        onRestart={restart}
        canBack={canGoBack()}
        canForward={canGoForward()}
      />
      <div className="flex-1 min-h-0 grid grid-cols-[minmax(460px,50%)_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden">
        <ChatWindow />
        <PanelHost panel={panel} />
      </div>
    </div>
  );
}
