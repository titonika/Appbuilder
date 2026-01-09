import { Transaction } from "./TransactionForm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Language, DisplayCurrency, translations, formatCurrency } from "../utils/translations";

interface DashboardProps {
  transactions: Transaction[];
  language: Language;
  displayCurrency: DisplayCurrency;
}

// Exchange rates for converting currencies to USD
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 1.09,
  CRYPTO: 1,
};

const USD_TO_UAH = 41.5;

export function Dashboard({ transactions, language, displayCurrency }: DashboardProps) {
  const t = translations[language];
  
  // Convert all transactions to USD first
  const convertToUSD = (amount: number, currency: "USD" | "EUR" | "CRYPTO") => {
    return amount * EXCHANGE_RATES[currency];
  };
  
  const totalIncomeUSD = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + convertToUSD(t.amount, t.currency), 0);

  const totalExpensesUSD = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + convertToUSD(t.amount, t.currency), 0);

  const balanceUSD = totalIncomeUSD - totalExpensesUSD;
  
  const balance = displayCurrency === 'USD' 
    ? balanceUSD 
    : balanceUSD * USD_TO_UAH;
    
  const income = displayCurrency === 'USD'
    ? totalIncomeUSD
    : totalIncomeUSD * USD_TO_UAH;
    
  const expenses = displayCurrency === 'USD'
    ? totalExpensesUSD
    : totalExpensesUSD * USD_TO_UAH;

  const stats = [
    {
      title: t.totalBalance,
      value: balance,
      icon: Wallet,
      color: balanceUSD >= 0 ? "text-blue-600" : "text-red-600",
      bgColor: balanceUSD >= 0 ? "bg-blue-50" : "bg-red-50",
      subtitle: balanceUSD >= 0 ? t.youreInGreen : t.spendingMore,
    },
    {
      title: t.totalIncome,
      value: income,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      subtitle: `${transactions.filter((t) => t.type === "income").length} ${t.transactions}`,
    },
    {
      title: t.totalExpenses,
      value: expenses,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      subtitle: `${transactions.filter((t) => t.type === "expense").length} ${t.transactions}`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} rounded-full p-2`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {formatCurrency(stat.value, displayCurrency)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}