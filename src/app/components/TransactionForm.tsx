import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PlusCircle } from "lucide-react";
import { Language, translations } from "../utils/translations";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  currency: "USD" | "EUR" | "CRYPTO";
  category: string;
  description: string;
  date: string;
}

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, "id">) => void;
  language: Language;
}

export function TransactionForm({ onAddTransaction, language }: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"USD" | "EUR" | "CRYPTO">("USD");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  
  const t = translations[language];

  const EXPENSE_CATEGORIES = [
    t.foodDining,
    t.shopping,
    t.transportation,
    t.billsUtilities,
    t.entertainment,
    t.healthcare,
    t.other,
  ];

  const INCOME_CATEGORIES = [
    t.salary,
    t.freelance,
    t.investment,
    t.gift,
    t.other,
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onAddTransaction({
      type,
      amount: parseFloat(amount),
      currency,
      category,
      description,
      date: new Date().toISOString(),
    });

    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");
  };

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          {t.addTransaction}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.type}</Label>
              <Select value={type} onValueChange={(val) => setType(val as "income" | "expense")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">{t.income}</SelectItem>
                  <SelectItem value="expense">{t.expense}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t.currency || "Валюта"}</Label>
              <Select value={currency} onValueChange={(val) => setCurrency(val as "USD" | "EUR" | "CRYPTO")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="CRYPTO">CRYPTO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">{t.amount}</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t.category}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectCategory} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.descriptionOptional}</Label>
            <Input
              id="description"
              placeholder={t.enterDescription}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            {t.addTransaction}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}