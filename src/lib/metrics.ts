export type CampaignMetrics = {
  channel: "email" | "sms";
  sent: number;
  delivered: number;
  opens: number;
  clicks: number;
  meetings: number;
  openRate: number;
  ctr: number;
  meetingRate: number;
};

export function computeMetrics(emailCount: number, smsCount: number) {
  const email: CampaignMetrics = {
    channel: "email",
    sent: emailCount,
    delivered: Math.round(emailCount * 0.97),
    opens: Math.round(emailCount * 0.22),
    clicks: Math.round(emailCount * 0.012),
    meetings: Math.round(emailCount * 0.0032),
    openRate: 22.0,
    ctr: 1.2,
    meetingRate: 0.32,
  };
  const sms: CampaignMetrics = {
    channel: "sms",
    sent: smsCount,
    delivered: Math.round(smsCount * 0.99),
    opens: Math.round(smsCount * 0.92),
    clicks: Math.round(smsCount * 0.048),
    meetings: Math.round(smsCount * 0.019),
    openRate: 92.0,
    ctr: 4.8,
    meetingRate: 1.9,
  };
  return { email, sms };
}

export function dailySeries(total: number, days = 7) {
  // Rozkład malejący od dnia startu
  const weights = [0.28, 0.22, 0.16, 0.12, 0.1, 0.07, 0.05];
  const arr = weights.slice(0, days).map((w) => Math.round(total * w));
  const labels = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];
  return arr.map((v, i) => ({ day: labels[i], value: v }));
}
