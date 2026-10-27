"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { PanelId } from "@/lib/store";
import Welcome from "./Welcome";
import DataSources from "./DataSources";
import PotentialSegment from "./PotentialSegment";
import PreviousCampaignDiagnosis from "./PreviousCampaignDiagnosis";
import CampaignPlan from "./CampaignPlan";
import SendResults from "./SendResults";
import Summary from "./Summary";

const map: Record<PanelId, React.ReactNode> = {
  welcome: <Welcome />,
  dataSources: <DataSources />,
  potentialSegment: <PotentialSegment />,
  previousCampaignDiagnosis: <PreviousCampaignDiagnosis />,
  campaignPlan: <CampaignPlan />,
  sendResults: <SendResults />,
  summary: <Summary />,
};

export default function PanelHost({ panel }: { panel: PanelId }) {
  return (
    <div className="relative h-full overflow-hidden bg-[var(--bg)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={panel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.16 }}
          className="absolute inset-0 overflow-y-auto"
        >
          {map[panel]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
