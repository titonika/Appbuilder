import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DollarSign, Euro, Coins } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Language, DisplayCurrency, translations, formatCurrency } from "../utils/translations";
import { CurrencyNotes, CurrencyNote } from "./CurrencyNotes";
import { Transaction } from "./TransactionForm";

interface CurrencyBalance {
  usd: number;
  eur: number;
  crypto: number;
}

interface CurrencyBalancesProps {
  balances: CurrencyBalance;
  onUpdateBalances: (balances: CurrencyBalance) => void;
  language: Language;
  displayCurrency: DisplayCurrency;
  transactions: Transaction[];
  currencyNotes: Record<string, CurrencyNote[]>;
  onAddCurrencyNote: (currency: string, note: Omit<CurrencyNote, "id">) => void;
  onDeleteCurrencyNote: (currency: string, noteId: string) => void;
}

interface ExchangeRates {
  USD_TO_UAH: number;
  EUR_TO_UAH: number;
  EUR_TO_USD: number;
}

export function CurrencyBalances({
  balances,
  onUpdateBalances,
  language,
  displayCurrency,
  transactions,
  currencyNotes,
  onAddCurrencyNote,
  onDeleteCurrencyNote,
}: CurrencyBalancesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBalances, setTempBalances] = useState(balances);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({
    USD_TO_UAH: 41.5,
    EUR_TO_UAH: 45.0,
    EUR_TO_USD: 1.09,
  });
  const [isLoadingRates, setIsLoadingRates] = useState(true);
  
  const t = translations[language];

  // Fetch live exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setIsLoadingRates(true);
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
          setExchangeRates({
            USD_TO_UAH: data.rates.UAH || 41.5,
            EUR_TO_UAH: data.rates.UAH / data.rates.EUR || 45.0,
            EUR_TO_USD: 1 / data.rates.EUR || 1.09,
          });
        }
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        // Keep default rates on error
      } finally {
        setIsLoadingRates(false);
      }
    };

    fetchExchangeRates();
    // Update rates every 30 minutes
    const interval = setInterval(fetchExchangeRates, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate total income and expenses
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => {
      if (t.currency === "USD") return sum + t.amount;
      if (t.currency === "EUR") return sum + t.amount * exchangeRates.EUR_TO_USD;
      return sum + t.amount; // CRYPTO
    }, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => {
      if (t.currency === "USD") return sum + t.amount;
      if (t.currency === "EUR") return sum + t.amount * exchangeRates.EUR_TO_USD;
      return sum + t.amount; // CRYPTO
    }, 0);

  // Calculate currency notes spending
  const usdNoteSpent = currencyNotes.usd?.reduce((sum, note) => sum + note.amount, 0) || 0;
  const eurNoteSpent = currencyNotes.eur?.reduce((sum, note) => sum + note.amount, 0) || 0;
  const cryptoNoteSpent = currencyNotes.crypto?.reduce((sum, note) => sum + note.amount, 0) || 0;

  // Total in USD: balances + income - expenses - currency notes
  const totalInUSD =
    (balances.usd - usdNoteSpent) +
    (balances.eur - eurNoteSpent) * exchangeRates.EUR_TO_USD +
    (balances.crypto - cryptoNoteSpent) +
    totalIncome -
    totalExpenses;

  const totalInDisplayCurrency = displayCurrency === 'USD' 
    ? totalInUSD 
    : totalInUSD * exchangeRates.USD_TO_UAH;

  const handleSave = () => {
    onUpdateBalances(tempBalances);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempBalances(balances);
    setIsEditing(false);
  };

  const currencies = [
    {
      name: t.usDollar,
      code: "USD",
      symbol: "$",
      value: balances.usd,
      available: balances.usd - usdNoteSpent,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      key: "usd" as keyof CurrencyBalance,
      decimals: 2,
    },
    {
      name: t.euro,
      code: "EUR",
      symbol: "€",
      value: balances.eur,
      available: balances.eur - eurNoteSpent,
      icon: Euro,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      key: "eur" as keyof CurrencyBalance,
      decimals: 2,
    },
    {
      name: t.cryptocurrency,
      code: "CRYPTO",
      symbol: "$",
      value: balances.crypto,
      available: balances.crypto - cryptoNoteSpent,
      icon: Coins,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      key: "crypto" as keyof CurrencyBalance,
      decimals: 2,
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-white">{t.totalPortfolio}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {formatCurrency(totalInDisplayCurrency, displayCurrency)}
          </div>
          <p className="text-purple-100 text-sm mt-1">
            {t.combinedValue} {displayCurrency === 'USD' ? 'в USD' : 'в UAH'}
          </p>
          {!isLoadingRates && (
            <p className="text-purple-200 text-xs mt-2">
              {t.exchangeRate}: $1 = ₴{exchangeRates.USD_TO_UAH.toFixed(2)}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {currencies.map((currency) => {
          const Icon = currency.icon;
          const spent = currency.value - currency.available;
          return (
            <Card 
              key={currency.code}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => !isEditing && setSelectedCurrency(currency.key)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {currency.name}
                </CardTitle>
                <div className={`${currency.bgColor} rounded-full p-2`}>
                  <Icon className={`h-4 w-4 ${currency.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor={currency.key} className="text-xs">
                      {t.enterAmount}
                    </Label>
                    <Input
                      id={currency.key}
                      type="number"
                      step="0.01"
                      value={tempBalances[currency.key]}
                      onChange={(e) =>
                        setTempBalances({
                          ...tempBalances,
                          [currency.key]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-8"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  <>
                    <div className={`text-2xl font-bold ${currency.color}`}>
                      {currency.symbol}
                      {currency.available.toFixed(currency.decimals)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {currency.code} {spent > 0 && `(${t.total}: ${currency.symbol}${spent.toFixed(2)})`}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}</div>

      <div className="flex gap-2">
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="w-full"
          >
            {t.updateBalances}
          </Button>
        ) : (
          <>
            <Button onClick={handleSave} className="flex-1">
              {t.saveChanges}
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              {t.cancel}
            </Button>
          </>
        )}
      </div>

      {/* Currency Notes Dialog */}
      {selectedCurrency && (
        <CurrencyNotes
          isOpen={!!selectedCurrency}
          onClose={() => setSelectedCurrency(null)}
          currencyName={currencies.find((c) => c.key === selectedCurrency)?.name || ""}
          currencySymbol={currencies.find((c) => c.key === selectedCurrency)?.symbol || "$"}
          notes={currencyNotes[selectedCurrency] || []}
          onAddNote={(note) => onAddCurrencyNote(selectedCurrency, note)}
          onDeleteNote={(id) => onDeleteCurrencyNote(selectedCurrency, id)}
          language={language}
        />
      )}
    </div>
  );
}