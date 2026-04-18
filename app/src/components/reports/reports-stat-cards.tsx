import { DashboardStatCards } from "@/components/dashboard/dashboard-stat-cards";

type ReportsStatCardsProps = {
  summary: {
    income: number;
    expense: number;
    balance: number;
  };
};

export function ReportsStatCards({ summary }: ReportsStatCardsProps) {
  return <DashboardStatCards summary={summary} />;
}
