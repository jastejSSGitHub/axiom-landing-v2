/** Row shape for public `axiom_scores` reads on the landing page. */
export type AxiomScoreRow = {
  score_total: number | null;
  score_fundamentals: number | null;
  score_technicals: number | null;
  score_rerating: number | null;
  score_discovery: number | null;
  narrative: string | null;
  symbol?: string | null;
  computed_at?: string | null;
};
