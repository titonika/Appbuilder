import { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { TransactionForm, Transaction } from "./components/TransactionForm";
import { TransactionList } from "./components/TransactionList";
import { SpendingChart } from "./components/SpendingChart";
import { IncomeChart } from "./components/IncomeChart";
import { CurrencyBalances } from "./components/CurrencyBalances";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { CurrencyNote } from "./components/CurrencyNotes";
import { DollarSign } from "lucide-react";
import { Language, DisplayCurrency, translations } from "./utils/translations";

interface CurrencyBalance {
  usd: number;
  eur: number;
  crypto: number;
}

// Default initial data
const defaultTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    amount: 3000,
    currency: "USD",
    category: "Salary",
    description: "Monthly salary",
    date: new Date(2026, 0, 1).toISOString(),
  },
  {
    id: "2",
    type: "expense",
    amount: 50,
    currency: "USD",
    category: "Food & Dining",
    description: "Grocery shopping",
    date: new Date(2026, 0, 3).toISOString(),
  },
  {
    id: "3",
    type: "expense",
    amount: 120,
    currency: "EUR",
    category: "Bills & Utilities",
    description: "Electric bill",
    date: new Date(2026, 0, 5).toISOString(),
  },
  {
    id: "4",
    type: "expense",
    amount: 30,
    currency: "USD",
    category: "Transportation",
    description: "Gas",
    date: new Date(2026, 0, 6).toISOString(),
  },
  {
    id: "5",
    type: "income",
    amount: 500,
    currency: "CRYPTO",
    category: "Freelance",
    description: "Web design project",
    date: new Date(2026, 0, 7).toISOString(),
  },
];

const defaultBalances: CurrencyBalance = {
  usd: 5000,
  eur: 2500,
  crypto: 1500,
};

const defaultCurrencyNotes: Record<string, CurrencyNote[]> = {
  usd: [],
  eur: [],
  crypto: [],
};

export default function App() {
  // Load saved data from localStorage
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('moneyManager_language');
    return (saved as Language) || 'en';
  });
  
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>(() => {
    const saved = localStorage.getItem('moneyManager_displayCurrency');
    return (saved as DisplayCurrency) || 'USD';
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('moneyManager_transactions');
    return saved ? JSON.parse(saved) : defaultTransactions;
  });
  
  const [currencyBalances, setCurrencyBalances] = useState<CurrencyBalance>(() => {
    const saved = localStorage.getItem('moneyManager_balances');
    return saved ? JSON.parse(saved) : defaultBalances;
  });

  const [currencyNotes, setCurrencyNotes] = useState<Record<string, CurrencyNote[]>>(() => {
    const saved = localStorage.getItem('moneyManager_currencyNotes');
    return saved ? JSON.parse(saved) : defaultCurrencyNotes;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('moneyManager_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('moneyManager_displayCurrency', displayCurrency);
  }, [displayCurrency]);

  useEffect(() => {
    localStorage.setItem('moneyManager_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('moneyManager_balances', JSON.stringify(currencyBalances));
  }, [currencyBalances]);

  useEffect(() => {
    localStorage.setItem('moneyManager_currencyNotes', JSON.stringify(currencyNotes));
  }, [currencyNotes]);

  const t = translations[language];

  const handleAddTransaction = (
    newTransaction: Omit<Transaction, "id">
  ) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    setTransactions([transaction, ...transactions]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };
  
  const handleUpdateBalances = (balances: CurrencyBalance) => {
    setCurrencyBalances(balances);
  };
  
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };
  
  const handleCurrencyChange = (newCurrency: DisplayCurrency) => {
    setDisplayCurrency(newCurrency);
  };

  const handleAddCurrencyNote = (currency: string, note: Omit<CurrencyNote, "id">) => {
    const newNote: CurrencyNote = {
      ...note,
      id: Date.now().toString(),
    };
    setCurrencyNotes({
      ...currencyNotes,
      [currency]: [...(currencyNotes[currency] || []), newNote],
    });
  };

  const handleDeleteCurrencyNote = (currency: string, noteId: string) => {
    setCurrencyNotes({
      ...currencyNotes,
      [currency]: (currencyNotes[currency] || []).filter((note) => note.id !== noteId),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-3">
              <DollarSign className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{t.appName}</h1>
              <p className="text-muted-foreground">
                {t.appDescription}
              </p>
            </div>
          </div>
          <LanguageSwitcher
            currentLanguage={language}
            currentCurrency={displayCurrency}
            onLanguageChange={handleLanguageChange}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>

        {/* Currency Balances */}
        <CurrencyBalances
          balances={currencyBalances}
          onUpdateBalances={handleUpdateBalances}
          language={language}
          displayCurrency={displayCurrency}
          transactions={transactions}
          currencyNotes={currencyNotes}
          onAddCurrencyNote={handleAddCurrencyNote}
          onDeleteCurrencyNote={handleDeleteCurrencyNote}
        />

        {/* Dashboard Stats */}
        <Dashboard 
          transactions={transactions} 
          language={language}
          displayCurrency={displayCurrency}
        />

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <TransactionForm 
              onAddTransaction={handleAddTransaction}
              language={language}
            />
            <SpendingChart 
              transactions={transactions}
              language={language}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              language={language}
            />
            <IncomeChart 
              transactions={transactions}
              language={language}
            />
          </div>
        </div>
      </div>
    </div>
  );
}