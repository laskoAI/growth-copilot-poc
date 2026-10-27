"use client";
import { create } from "zustand";

export type PanelId =
  | "welcome"
  | "dataSources"
  | "potentialSegment"
  | "previousCampaignDiagnosis"
  | "campaignPlan"
  | "sendResults"
  | "summary";

export type StageId = 0 | 1 | 2 | 3 | 4;

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
};

// Store trzyma WYŁĄCZNIE minimalny, autorytatywny stan. Wszystko inne
// (widoczne wiadomości, panel, krok paska postępu) jest czystą funkcją
// tego stanu — patrz lib/demoScript.ts (getPanelForStep, getStageForStep,
// getVisibleMessages). Dzięki temu cofnij/dalej/restart to tylko ustawienie
// liczby, nigdy nie ma czego "rozjechać".
export type Store = {
  stepIndex: number;
  maxStepReached: number;

  // Stan efemeryczny: "trwa ujawnianie kroku pendingStep, jeszcze niezacommitowanego".
  // Zawsze kasowany na starcie goBack/goForward/restart w lib/nav.ts, razem
  // z anulowaniem jedynego setTimeout w aplikacji — nigdy nie zostaje "w locie".
  pendingStep: number | null;
  isTyping: boolean;

  setStepIndex: (i: number) => void;
  setMaxStepReached: (i: number) => void;
  setPending: (step: number | null) => void;
  setTyping: (v: boolean) => void;
  reset: () => void;
};

const initial = {
  stepIndex: 0,
  maxStepReached: 0,
  pendingStep: null as number | null,
  isTyping: false,
};

export const useStore = create<Store>((set) => ({
  ...initial,
  setStepIndex: (i) => set({ stepIndex: i }),
  setMaxStepReached: (i) => set({ maxStepReached: i }),
  setPending: (step) => set({ pendingStep: step }),
  setTyping: (v) => set({ isTyping: v }),
  reset: () => set({ ...initial }),
}));
