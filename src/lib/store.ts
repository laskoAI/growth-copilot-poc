"use client";
import { create } from "zustand";
import type { Filters } from "./fakeData";

export type PanelId =
  | "welcome"
  | "segment"
  | "baseProposal"
  | "segmentationPlanner"
  | "creatives"
  | "channel"
  | "launch"
  | "report"
  | "segmentPerformance"
  | "wave2Report"
  | "weekLater"
  | "segmentBreakdown"
  | "olxDiagnosis"
  | "olxBase"
  | "olxSegments"
  | "olxCreatives"
  | "olxAB"
  | "olxChannelPlan"
  | "olxLive"
  | "olxPeople"
  | "olxLearnings"
  | "olxNext"
  | "olxWinback"
  | "pozBase"
  | "pozClusters"
  | "pozContent"
  | "pozPath"
  | "pozLive"
  | "pozSummary"
  | "pozNext";

export type FlowId = "A" | "B" | "C" | null;

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
};

export type Store = {
  flow: FlowId;
  panel: PanelId;
  stepIndex: number;
  messages: ChatMessage[];
  isTyping: boolean;
  filters: Filters;
  segmentCount: number;
  selectedCreativeId: string | null;
  emailShare: number; // 0..1
  emailCount: number;
  smsCount: number;
  launched: boolean;
  weekAdvanced: boolean;
  baseAccepted: boolean;

  setFlow: (f: FlowId) => void;
  setPanel: (p: PanelId) => void;
  addMessage: (m: ChatMessage) => void;
  setTyping: (v: boolean) => void;
  setStep: (i: number) => void;
  setFilters: (f: Filters) => void;
  setSegmentCount: (n: number) => void;
  setSelectedCreative: (id: string) => void;
  setSplit: (email: number, sms: number, share: number) => void;
  setLaunched: (v: boolean) => void;
  setWeekAdvanced: (v: boolean) => void;
  setBaseAccepted: (v: boolean) => void;
  reset: () => void;
};

const initial = {
  flow: null as FlowId,
  panel: "welcome" as PanelId,
  stepIndex: 0,
  messages: [] as ChatMessage[],
  isTyping: false,
  filters: {} as Filters,
  segmentCount: 0,
  selectedCreativeId: null as string | null,
  emailShare: 0.5,
  emailCount: 5000,
  smsCount: 5000,
  launched: false,
  weekAdvanced: false,
  baseAccepted: false,
};

export const useStore = create<Store>((set) => ({
  ...initial,
  setFlow: (f) => set({ flow: f }),
  setPanel: (p) => set({ panel: p }),
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  setTyping: (v) => set({ isTyping: v }),
  setStep: (i) => set({ stepIndex: i }),
  setFilters: (f) => set({ filters: f }),
  setSegmentCount: (n) => set({ segmentCount: n }),
  setSelectedCreative: (id) => set({ selectedCreativeId: id }),
  setSplit: (email, sms, share) => set({ emailCount: email, smsCount: sms, emailShare: share }),
  setLaunched: (v) => set({ launched: v }),
  setWeekAdvanced: (v) => set({ weekAdvanced: v }),
  setBaseAccepted: (v) => set({ baseAccepted: v }),
  reset: () => set({ ...initial }),
}));
