import { DashboardCategoryBreakdown } from "@/components/dashboard/dashboard-category-breakdown";

type ReportsBreakdownSectionProps = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  items: Array<{
    categoryId: string;
    name: string;
    color: string;
    total: number;
    share: number;
  }>;
};

export function ReportsBreakdownSection(props: ReportsBreakdownSectionProps) {
  return <DashboardCategoryBreakdown {...props} />;
}
