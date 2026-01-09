import { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { TransactionForm, Transaction } from "./components/TransactionForm";
import { TransactionList } from "./components/TransactionList";
import { SpendingChart } from "./components/SpendingChart";
import { IncomeChart } from "./components/IncomeChart";
import { IncomeTable } from "./components/IncomeTable";
import { CurrencyBalances } from "./components/CurrencyBalances";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { MonthSelector } from "./components/MonthSelector";
import { ThemeSwitcher, ThemeConfig } from "./components/ThemeSwitcher";
import { PasswordProtection } from "./components/PasswordProtection";
import { LoginScreen } from "./components/LoginScreen";
import { CurrencyNote } from "./components/CurrencyNotes";
import { GoogleSheetsSync } from "./components/GoogleSheetsSync";
import { TrendingUp } from "lucide-react";
import { Button } from "./components/ui/button";
import { Language, DisplayCurrency, translations } from "./utils/translations";

interface CurrencyBalance {
  usd: number;
  eur: number;
  crypto: number;
}

interface MonthData {
  transactions: Transaction[];
  currencyBalances: CurrencyBalance;
  currencyNotes: Record<string, CurrencyNote[]>;
}

// Helper to get current month key
const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

// Default initial data
const defaultTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    amount: 3000,
    currency: "USD",
    category: "Salary",
    description: "Monthly salary",
    date: new Date().toISOString(),
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
  // Password protection
  const [password, setPassword] = useState<string | null>(() => {
    return localStorage.getItem('moneyManager_password');
  });
  const [isUnlocked, setIsUnlocked] = useState(!password);

  // Load saved data from localStorage
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('moneyManager_language');
    return (saved as Language) || 'ru';
  });
  
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>(() => {
    const saved = localStorage.getItem('moneyManager_displayCurrency');
    return (saved as DisplayCurrency) || 'USD';
  });
  
  // Theme state
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('moneyManager_theme');
    return saved ? JSON.parse(saved) : {
      mode: 'light',
      primaryColor: '#0ea5e9',
      backgroundColor: '#f8fafc',
      cardColor: '#ffffff',
      textColor: '#0f172a',
    };
  });

  // Month history
  const [currentMonth, setCurrentMonth] = useState<string>(getCurrentMonthKey());
  const [monthHistory, setMonthHistory] = useState<Record<string, MonthData>>(() => {
    const saved = localStorage.getItem('moneyManager_monthHistory');
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize with current month
    return {
      [getCurrentMonthKey()]: {
        transactions: defaultTransactions,
        currencyBalances: defaultBalances,
        currencyNotes: defaultCurrencyNotes,
      },
    };
  });

  // UI States
  const [showIncomeTable, setShowIncomeTable] = useState(false);

  // Get current month data
  const currentMonthData = monthHistory[currentMonth] || {
    transactions: [],
    currencyBalances: defaultBalances,
    currencyNotes: defaultCurrencyNotes,
  };

  // Available months
  const availableMonths = Object.keys(monthHistory).sort();

  // Automatically create new month if it doesn't exist
  useEffect(() => {
    const currentKey = getCurrentMonthKey();
    if (!monthHistory[currentKey]) {
      // Get last month's data
      const lastMonthKey = availableMonths[availableMonths.length - 1];
      const lastMonthData = monthHistory[lastMonthKey];
      
      // Create new month with balances from last month but reset transactions
      setMonthHistory({
        ...monthHistory,
        [currentKey]: {
          transactions: [],
          currencyBalances: lastMonthData?.currencyBalances || defaultBalances,
          currencyNotes: lastMonthData?.currencyNotes || defaultCurrencyNotes,
        },
      });
      setCurrentMonth(currentKey);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('moneyManager_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('moneyManager_displayCurrency', displayCurrency);
  }, [displayCurrency]);

  useEffect(() => {
    localStorage.setItem('moneyManager_theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('moneyManager_monthHistory', JSON.stringify(monthHistory));
  }, [monthHistory]);

  useEffect(() => {
    if (password) {
      localStorage.setItem('moneyManager_password', password);
    } else {
      localStorage.removeItem('moneyManager_password');
    }
  }, [password]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-background', theme.backgroundColor);
    root.style.setProperty('--color-card', theme.cardColor);
    root.style.setProperty('--color-text', theme.textColor);
    
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const t = translations[language];

  // Password handlers
  const handleLogin = (inputPassword: string) => {
    if (inputPassword === password) {
      setIsUnlocked(true);
      return true;
    }
    return false;
  };

  const handleSetPassword = (newPassword: string) => {
    setPassword(newPassword);
    setIsUnlocked(true);
  };

  const handleRemovePassword = () => {
    setPassword(null);
    setIsUnlocked(true);
  };

  // Month handlers
  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
  };

  const handleCreateMonth = (monthKey: string) => {
    // Get the most recent month data or use defaults
    const sortedMonths = Object.keys(monthHistory).sort();
    const latestMonth = sortedMonths[sortedMonths.length - 1];
    const latestData = monthHistory[latestMonth];
    
    setMonthHistory({
      ...monthHistory,
      [monthKey]: {
        transactions: [],
        currencyBalances: latestData?.currencyBalances || defaultBalances,
        currencyNotes: latestData?.currencyNotes || defaultCurrencyNotes,
      },
    });
  };

  // Update current month data
  const updateCurrentMonthData = (data: Partial<MonthData>) => {
    setMonthHistory({
      ...monthHistory,
      [currentMonth]: {
        ...currentMonthData,
        ...data,
      },
    });
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, "id">) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    updateCurrentMonthData({
      transactions: [transaction, ...currentMonthData.transactions],
    });
  };

  const handleDeleteTransaction = (id: string) => {
    updateCurrentMonthData({
      transactions: currentMonthData.transactions.filter((t) => t.id !== id),
    });
  };
  
  const handleUpdateBalances = (balances: CurrencyBalance) => {
    updateCurrentMonthData({
      currencyBalances: balances,
    });
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
    updateCurrentMonthData({
      currencyNotes: {
        ...currentMonthData.currencyNotes,
        [currency]: [...(currentMonthData.currencyNotes[currency] || []), newNote],
      },
    });
  };

  const handleDeleteCurrencyNote = (currency: string, noteId: string) => {
    updateCurrentMonthData({
      currencyNotes: {
        ...currentMonthData.currencyNotes,
        [currency]: (currentMonthData.currencyNotes[currency] || []).filter((note) => note.id !== noteId),
      },
    });
  };

  // Google Sheets handlers
  const handleImportFromSheets = (importedHistory: Record<string, MonthData>) => {
    // Merge imported data with existing data
    const mergedHistory = { ...monthHistory };
    
    Object.entries(importedHistory).forEach(([month, data]) => {
      if (mergedHistory[month]) {
        // Merge with existing month data
        const confirm = window.confirm(
          language === 'en'
            ? `Month ${month} already exists. Overwrite?`
            : language === 'uk'
            ? `Місяць ${month} вже існує. Перезаписати?`
            : `Месяц ${month} уже существует. Перезаписать?`
        );
        if (confirm) {
          mergedHistory[month] = data;
        }
      } else {
        mergedHistory[month] = data;
      }
    });
    
    setMonthHistory(mergedHistory);
  };

  // Show login screen if password is set and not unlocked
  if (!isUnlocked) {
    return <LoginScreen onLogin={handleLogin} language={language} />;
  }

  const dynamicStyles = {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
  };

  const cardStyles = {
    '--tw-bg-opacity': '1',
    backgroundColor: theme.cardColor,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen p-4 md:p-8" style={dynamicStyles}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex-1">
            <MonthSelector
              currentMonth={currentMonth}
              availableMonths={availableMonths}
              onMonthChange={handleMonthChange}
              onCreateMonth={handleCreateMonth}
              language={language}
              theme={theme}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ThemeSwitcher
              currentTheme={theme}
              onThemeChange={setTheme}
              language={language}
            />
            <PasswordProtection
              hasPassword={!!password}
              onSetPassword={handleSetPassword}
              onRemovePassword={handleRemovePassword}
              language={language}
            />
            <LanguageSwitcher
              currentLanguage={language}
              currentCurrency={displayCurrency}
              onLanguageChange={handleLanguageChange}
              onCurrencyChange={handleCurrencyChange}
            />
          </div>
        </div>

        {/* Month Selector - moved to top */}
        <div className="flex items-center justify-end flex-wrap gap-4">
          <GoogleSheetsSync
            monthHistory={monthHistory}
            onImportData={handleImportFromSheets}
            language={language}
          />
          <Button
            variant="outline"
            onClick={() => setShowIncomeTable(true)}
            className="gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            {t.viewAllIncome || "Все доходы"}
          </Button>
        </div>

        {/* Currency Balances */}
        <CurrencyBalances
          balances={currentMonthData.currencyBalances}
          onUpdateBalances={handleUpdateBalances}
          language={language}
          displayCurrency={displayCurrency}
          transactions={currentMonthData.transactions}
          currencyNotes={currentMonthData.currencyNotes}
          onAddCurrencyNote={handleAddCurrencyNote}
          onDeleteCurrencyNote={handleDeleteCurrencyNote}
          theme={theme}
        />

        {/* Dashboard Stats */}
        <Dashboard 
          transactions={currentMonthData.transactions} 
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
              transactions={currentMonthData.transactions}
              language={language}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <TransactionList
              transactions={currentMonthData.transactions}
              onDeleteTransaction={handleDeleteTransaction}
              language={language}
            />
            <IncomeChart 
              transactions={currentMonthData.transactions}
              language={language}
            />
          </div>
        </div>
      </div>

      {/* Income Table Dialog */}
      <IncomeTable
        isOpen={showIncomeTable}
        onClose={() => setShowIncomeTable(false)}
        transactions={currentMonthData.transactions}
        language={language}
      />
    </div>
  );
}