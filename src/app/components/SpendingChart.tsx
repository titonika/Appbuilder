import { Transaction } from "./TransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Language, translations } from "../utils/translations";

interface SpendingChartProps {
  transactions: Transaction[];
  language: Language;
}

const COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
];

export function SpendingChart({ transactions, language }: SpendingChartProps) {
  const t = translations[language];
  
  const expenses = transactions.filter((t) => t.type === "expense");

  // Group expenses by category
  const categoryTotals = expenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.spendingByCategory}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">
            {t.noExpenseData}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.spendingByCategory}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}