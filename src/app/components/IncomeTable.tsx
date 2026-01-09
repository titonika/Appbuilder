import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Transaction } from "./TransactionForm";
import { Language, translations } from "../utils/translations";
import { TrendingUp } from "lucide-react";

interface IncomeTableProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  language: Language;
}

export function IncomeTable({ isOpen, onClose, transactions, language }: IncomeTableProps) {
  const t = translations[language];

  const incomeTransactions = transactions
    .filter((t) => t.type === "income")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "EUR":
        return "€";
      case "UAH":
        return "₴";
      default:
        return "$";
    }
  };

  const totalIncome = incomeTransactions.reduce((sum, t) => {
    // Convert to USD for total
    if (t.currency === "EUR") return sum + t.amount * 1.09;
    if (t.currency === "UAH") return sum + t.amount * 0.024;
    return sum + t.amount;
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            {t.allIncomeTransactions || "Все Поступления"}
          </DialogTitle>
          <DialogDescription>
            {t.viewAllIncome || "Просмотр всех доходов"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-700 mb-1">
              {t.totalIncome || "Общий доход"}
            </p>
            <p className="text-2xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </p>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.date || "Дата"}</TableHead>
                  <TableHead>{t.category || "Категория"}</TableHead>
                  <TableHead>{t.description || "Описание"}</TableHead>
                  <TableHead>{t.currency || "Валюта"}</TableHead>
                  <TableHead className="text-right">{t.amount || "Сумма"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      {t.noIncomeData || "Нет данных о доходах"}
                    </TableCell>
                  </TableRow>
                ) : (
                  incomeTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-green-50/50">
                      <TableCell className="font-medium">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {transaction.description || "-"}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1">
                          {getCurrencySymbol(transaction.currency)}
                          <span className="text-xs text-muted-foreground">
                            {transaction.currency}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        +{getCurrencySymbol(transaction.currency)}
                        {transaction.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
