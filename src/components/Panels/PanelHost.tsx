"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import Welcome from "./Welcome";
import SegmentBuilder from "./SegmentBuilder";
import BaseProposal from "./BaseProposal";
import SegmentationPlanner from "./SegmentationPlanner";
import CreativeCarousel from "./CreativeCarousel";
import ChannelSplit from "./ChannelSplit";
import LaunchAnimation from "./LaunchAnimation";
import ReportDashboard from "./ReportDashboard";
import SegmentPerformanceReport from "./SegmentPerformanceReport";
import Wave2Report from "./Wave2Report";
import WeekLaterReport from "./WeekLaterReport";
import SegmentBreakdown from "./SegmentBreakdown";
import { OlxDiagnosis, OlxBase, OlxSegments, OlxCreatives, OlxAB, OlxChannelPlan, OlxLive, OlxPeople, OlxLearnings, OlxNext, OlxWinback } from "./OlxPanels";
import { PozBase, PozClusters, PozContent, PozPath, PozLive, PozSummary, PozNext } from "./PozPanels";

export default function PanelHost() {
  const panel = useStore((s) => s.panel);

  const map: Record<string, React.ReactNode> = {
    welcome: <Welcome />,
    segment: <SegmentBuilder />,
    baseProposal: <BaseProposal />,
    segmentationPlanner: <SegmentationPlanner />,
    creatives: <CreativeCarousel />,
    channel: <ChannelSplit />,
    launch: <LaunchAnimation />,
    report: <ReportDashboard />,
    segmentPerformance: <SegmentPerformanceReport />,
    wave2Report: <Wave2Report />,
    weekLater: <WeekLaterReport />,
    segmentBreakdown: <SegmentBreakdown />,
    olxDiagnosis: <OlxDiagnosis />,
    olxBase: <OlxBase />,
    olxSegments: <OlxSegments />,
    olxCreatives: <OlxCreatives />,
    olxAB: <OlxAB />,
    olxChannelPlan: <OlxChannelPlan />,
    olxLive: <OlxLive />,
    olxPeople: <OlxPeople />,
    olxLearnings: <OlxLearnings />,
    olxNext: <OlxNext />,
    olxWinback: <OlxWinback />,
    pozBase: <PozBase />,
    pozClusters: <PozClusters />,
    pozContent: <PozContent />,
    pozPath: <PozPath />,
    pozLive: <PozLive />,
    pozSummary: <PozSummary />,
    pozNext: <PozNext />,
  };

  return (
    <div className="relative h-full overflow-hidden bg-[var(--bg)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={panel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 overflow-y-auto"
        >
          {map[panel]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
