// Jedyne miejsce w aplikacji, które planuje setTimeout do ujawniania treści.
// Każda nawigacja (cofnij/dalej/restart) najpierw kasuje ewentualny oczekujący
// timer, więc nic nie może "dogonić" użytkownika po tym, jak przeszedł już
// gdzie indziej.
import { useStore } from "./store";
import { script } from "./demoScript";

let pendingTimer: ReturnType<typeof setTimeout> | null = null;

function clearPendingTimer() {
  if (pendingTimer) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }
  useStore.getState().setPending(null);
  useStore.getState().setTyping(false);
}

export function canGoForward(): boolean {
  const { stepIndex, pendingStep } = useStore.getState();
  if (pendingStep !== null) return false; // ujawnianie w toku — poczekaj albo kliknij cofnij
  return stepIndex < script.length;
}

export function canGoBack(): boolean {
  return useStore.getState().stepIndex > 0;
}

export function goForward() {
  if (!canGoForward()) return;
  clearPendingTimer();
  const { stepIndex, maxStepReached } = useStore.getState();

  if (stepIndex < maxStepReached) {
    // Treść już kiedyś odwiedzona — pokaż od razu, bez opóźnienia.
    useStore.getState().setStepIndex(stepIndex + 1);
    return;
  }

  const step = script[stepIndex];
  if (!step) return;

  useStore.getState().setPending(stepIndex);
  useStore.getState().setTyping(true);
  pendingTimer = setTimeout(() => {
    const next = stepIndex + 1;
    const s = useStore.getState();
    s.setStepIndex(next);
    s.setMaxStepReached(Math.max(s.maxStepReached, next));
    s.setPending(null);
    s.setTyping(false);
    pendingTimer = null;
  }, step.aiTypingMs ?? 900);
}

export function goBack() {
  if (!canGoBack()) return;
  clearPendingTimer();
  useStore.getState().setStepIndex(useStore.getState().stepIndex - 1);
}

export function restart() {
  clearPendingTimer();
  useStore.getState().reset();
}
