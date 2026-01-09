import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Trash2, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Language, translations } from "../utils/translations";

export interface CurrencyNote {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  exchangeRate?: number;
}

interface CurrencyNotesProps {
  isOpen: boolean;
  onClose: () => void;
  currencyName: string;
  currencySymbol: string;
  notes: CurrencyNote[];
  onAddNote: (note: Omit<CurrencyNote, "id">) => void;
  onDeleteNote: (id: string) => void;
  language: Language;
}

export function CurrencyNotes({
  isOpen,
  onClose,
  currencyName,
  currencySymbol,
  notes,
  onAddNote,
  onDeleteNote,
  language,
}: CurrencyNotesProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [exchangeRate, setExchangeRate] = useState("");

  const t = translations[language];

  const handleAdd = () => {
    if (amount && description) {
      onAddNote({
        type,
        amount: parseFloat(amount),
        description,
        date: new Date(date).toISOString(),
        exchangeRate: exchangeRate ? parseFloat(exchangeRate) : undefined,
      });
      setAmount("");
      setDescription("");
      setExchangeRate("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  };

  const totalIncome = notes
    .filter((note) => note.type === "income")
    .reduce((sum, note) => sum + note.amount, 0);

  const totalExpense = notes
    .filter((note) => note.type === "expense")
    .reduce((sum, note) => sum + note.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currencyName} - {t.transactions || "Транзакции"}
          </DialogTitle>
          <DialogDescription>
            {t.addTransaction || "Добавьте записи о доходах и тратах этой валюты"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new note */}
          <div className="border rounded-lg p-4 space-y-3 bg-slate-50">
            <h3 className="font-semibold">{t.addTransaction || "Добавить запись"}</h3>

            <div className="space-y-2">
              <Label>{t.type}</Label>
              <Select
                value={type}
                onValueChange={(val) => setType(val as "income" | "expense")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">{t.income || "Доход"}</SelectItem>
                  <SelectItem value="expense">{t.expense || "Расход"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="amount">{t.amount || "Сумма"}</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="date">{t.date || "Дата"}</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="exchangeRate">
                {t.exchangeRate || "Курс (необязательно)"}
              </Label>
              <Input
                id="exchangeRate"
                type="number"
                step="0.01"
                placeholder={
                  language === "en"
                    ? "e.g., 41.50 UAH per 1 USD"
                    : "напр., 41.50 грн за 1 USD"
                }
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">{t.description || "Описание"}</Label>
              <Textarea
                id="description"
                placeholder={
                  type === "income"
                    ? language === "en"
                      ? "e.g., Bought crypto at..."
                      : "напр., Купил крипту по курсу..."
                    : t.transactionDescription || "Куда потрачено..."
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <Button onClick={handleAdd} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {t.addTransaction || "Добавить"}
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xs text-green-700 mb-1">{t.income || "Доход"}</div>
              <div className="text-lg font-bold text-green-600">
                {currencySymbol}{totalIncome.toFixed(2)}
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-xs text-red-700 mb-1">{t.expense || "Расход"}</div>
              <div className="text-lg font-bold text-red-600">
                {currencySymbol}{totalExpense.toFixed(2)}
              </div>
            </div>
            <div
              className={`${
                balance >= 0 ? "bg-blue-50" : "bg-orange-50"
              } rounded-lg p-3`}
            >
              <div
                className={`text-xs ${
                  balance >= 0 ? "text-blue-700" : "text-orange-700"
                } mb-1`}
              >
                {t.totalBalance || "Баланс"}
              </div>
              <div
                className={`text-lg font-bold ${
                  balance >= 0 ? "text-blue-600" : "text-orange-600"
                }`}
              >
                {currencySymbol}{balance.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Notes list */}
          <div className="space-y-2">
            <h3 className="font-semibold">{t.history || "История"}</h3>
            {notes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t.noTransactions || "Нет записей"}
              </p>
            ) : (
              <div className="space-y-2">
                {notes
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((note) => (
                    <div
                      key={note.id}
                      className={`border rounded-lg p-3 flex items-start justify-between hover:bg-slate-50 transition-colors ${
                        note.type === "income" ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {note.type === "income" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={`font-semibold text-lg ${
                              note.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {note.type === "income" ? "+" : "-"}{currencySymbol}{note.amount.toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(note.date).toLocaleDateString(language)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {note.description}
                        </p>
                        {note.exchangeRate && (
                          <p className="text-xs text-blue-600 mt-1">
                            {t.exchangeRate || "Курс"}: {note.exchangeRate} UAH
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteNote(note.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}