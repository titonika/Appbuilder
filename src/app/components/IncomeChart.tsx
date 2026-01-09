import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";
import { Transaction } from "./TransactionForm";
import { Language, translations } from "../utils/translations";

interface IncomeChartProps {
  transactions: Transaction[];
  language: Language;
}

const COLORS = [
  "#10b981", // green
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ec4899", // pink
];

export function IncomeChart({ transactions, language }: IncomeChartProps) {
  const t = translations[language];

  const incomeTransactions = transactions.filter((t) => t.type === "income");

  const incomeByCategory = incomeTransactions.reduce(
    (acc, transaction) => {
      const existing = acc.find((item) => item.name === transaction.category);
      if (existing) {
        existing.value += transaction.amount;
      } else {
        acc.push({ name: transaction.category, value: transaction.amount });
      }
      return acc;
    },
    [] as { name: string; value: number }[]
  );

  const total = incomeByCategory.reduce((sum, item) => sum + item.value, 0);

  if (incomeByCategory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            {t.incomeByCategory || "Доходы по Категориям"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            {t.noIncomeData || "Данных о доходах пока нет"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          {t.incomeByCategory || "Доходы по Категориям"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={incomeByCategory}
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
              {incomeByCategory.map((entry, index) => (
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
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t.total || "Всего"}: <span className="font-bold text-green-600">${total.toFixed(2)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
