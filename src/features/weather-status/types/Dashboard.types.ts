export type TitanStatsData = {
  uniqueConnections: number;
  totalConnections: number;
  ticketsNouveau: number;
  ticketsOuvert: number;
  ticketsEnAttente: number;
};

export type TitanStatsProps = {
  stats: TitanStatsData;
};
