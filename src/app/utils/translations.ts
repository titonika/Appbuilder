export type Language = 'en' | 'ru' | 'uk';
export type DisplayCurrency = 'USD' | 'UAH';

export const translations = {
  en: {
    // Header
    appName: 'Money Manager',
    appDescription: 'Track your income and expenses',
    
    // Currency Balances
    totalPortfolio: 'Total Portfolio Value',
    combinedValue: 'Combined value',
    usDollar: 'US Dollar',
    euro: 'Euro',
    cryptocurrency: 'Cryptocurrency',
    updateBalances: 'Update Balances',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    enterAmount: 'Enter amount',
    currency: 'Currency',
    
    // Dashboard
    totalBalance: 'Total Balance',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    youreInGreen: "You're in the green",
    spendingMore: 'Spending more than earning',
    transactions: 'Transactions',
    
    // Transaction Form
    addTransaction: 'Add Transaction',
    type: 'Type',
    income: 'Income',
    expense: 'Expense',
    amount: 'Amount',
    category: 'Category',
    selectCategory: 'Select category',
    description: 'Description',
    descriptionOptional: 'Description (Optional)',
    enterDescription: 'Enter description',
    transactionDescription: 'Where was it spent...',
    
    // Categories
    foodDining: 'Food & Dining',
    shopping: 'Shopping',
    transportation: 'Transportation',
    billsUtilities: 'Bills & Utilities',
    entertainment: 'Entertainment',
    healthcare: 'Healthcare',
    other: 'Other',
    salary: 'Salary',
    freelance: 'Freelance',
    investment: 'Investment',
    gift: 'Gift',
    
    // Transaction List
    recentTransactions: 'Recent Transactions',
    noTransactions: 'No transactions yet',
    
    // Spending Chart
    spendingByCategory: 'Spending by Category',
    noExpenseData: 'No expense data to display yet',
    incomeByCategory: 'Income by Category',
    noIncomeData: 'No income data to display yet',
    
    // Currency Notes
    history: 'History',
    total: 'Total Spent',
    date: 'Date',
    
    // Sample Data
    monthlySalary: 'Monthly salary',
    groceryShopping: 'Grocery shopping',
    electricBill: 'Electric bill',
    gas: 'Gas',
    webDesignProject: 'Web design project',
    
    // Exchange Rate
    exchangeRate: 'Exchange rate',
    loading: 'Loading...',
  },
  ru: {
    // Header
    appName: 'Менеджер Денег',
    appDescription: 'Отслеживайте доходы и расходы',
    
    // Currency Balances
    totalPortfolio: 'Общая Стоимость Портфеля',
    combinedValue: 'Общая стоимость',
    usDollar: 'Доллар США',
    euro: 'Евро',
    cryptocurrency: 'Криптовалюта',
    updateBalances: 'О��новить Балансы',
    saveChanges: 'Сохранить Изменения',
    cancel: 'Отмена',
    enterAmount: 'Введите сумму',
    currency: 'Валюта',
    
    // Dashboard
    totalBalance: 'Общий Баланс',
    totalIncome: 'Общий Доход',
    totalExpenses: 'Общие Расходы',
    youreInGreen: 'У вас положительный баланс',
    spendingMore: 'Расходы превышают доходы',
    transactions: 'Транзакции',
    
    // Transaction Form
    addTransaction: 'Добавить Транзакцию',
    type: 'Тип',
    income: 'Доход',
    expense: 'Расход',
    amount: 'Сумма',
    category: 'Категория',
    selectCategory: 'Выберите категорию',
    description: 'Описание',
    descriptionOptional: 'Описание (Необязательно)',
    enterDescription: 'Введите описание',
    transactionDescription: 'Куда потрачено...',
    
    // Categories
    foodDining: 'Еда и Рестораны',
    shopping: 'Покупки',
    transportation: 'Транспорт',
    billsUtilities: 'Счета и Коммунальные',
    entertainment: 'Развлечения',
    healthcare: 'Здравоохранение',
    other: 'Другое',
    salary: 'Зарплата',
    freelance: 'Фриланс',
    investment: 'Инвестиции',
    gift: 'Подарок',
    
    // Transaction List
    recentTransactions: 'Последние Транзакции',
    noTransactions: 'Транзакций пока нет',
    
    // Spending Chart
    spendingByCategory: 'Расходы по Категориям',
    noExpenseData: 'Данных о расходах пока нет',
    incomeByCategory: 'Доходы по Категориям',
    noIncomeData: 'Данных о доходах пока нет',
    
    // Currency Notes
    history: 'История',
    total: 'Всего Потрачено',
    date: 'Дата',
    
    // Sample Data
    monthlySalary: 'Месячная зарплата',
    groceryShopping: 'Покупка продуктов',
    electricBill: 'Счет за электричество',
    gas: 'Бензин',
    webDesignProject: 'Проект веб-дизайна',
    
    // Exchange Rate
    exchangeRate: 'Курс валют',
    loading: 'Загрузка...',
  },
  uk: {
    // Header
    appName: 'Менеджер Грошей',
    appDescription: 'Відстежуйте доходи та витрати',
    
    // Currency Balances
    totalPortfolio: 'Загальна Вартість Портфеля',
    combinedValue: 'Загальна вартість',
    usDollar: 'Долар США',
    euro: 'Євро',
    cryptocurrency: 'Криптовалюта',
    updateBalances: 'Оновити Баланси',
    saveChanges: 'Зберегти Зміни',
    cancel: 'Скасувати',
    enterAmount: 'Введіть суму',
    currency: 'Валюта',
    
    // Dashboard
    totalBalance: 'Загальний Баланс',
    totalIncome: 'Загальний Дохід',
    totalExpenses: 'Загальні Витрати',
    youreInGreen: 'У вас позитивний баланс',
    spendingMore: 'Витрати перевищують доходи',
    transactions: 'Транзакції',
    
    // Transaction Form
    addTransaction: 'Додати Транзакцію',
    type: 'Тип',
    income: 'Дохід',
    expense: 'Витрата',
    amount: 'Сума',
    category: 'Категорія',
    selectCategory: 'Оберіть категорію',
    description: 'Опис',
    descriptionOptional: 'Опис (Необов\'язково)',
    enterDescription: 'Введіть опис',
    transactionDescription: 'Куди витрачено...',
    
    // Categories
    foodDining: 'Їжа та Ресторани',
    shopping: 'Покупки',
    transportation: 'Транспорт',
    billsUtilities: 'Рахунки та Комунальні',
    entertainment: 'Розваги',
    healthcare: 'Охорона Здоров\'я',
    other: 'Інше',
    salary: 'Зарплата',
    freelance: 'Фріланс',
    investment: 'Інвестиції',
    gift: 'Подарунок',
    
    // Transaction List
    recentTransactions: 'Останні Транзакції',
    noTransactions: 'Транзакцій поки немає',
    
    // Spending Chart
    spendingByCategory: 'Витрати за Категоріями',
    noExpenseData: 'Даних про витрати поки немає',
    incomeByCategory: 'Доходи за Категоріями',
    noIncomeData: 'Даних про доходи поки немає',
    
    // Currency Notes
    history: 'Історія',
    total: 'Всього Витрачено',
    date: 'Дата',
    
    // Sample Data
    monthlySalary: 'Місячна зарплата',
    groceryShopping: 'Покупка продуктів',
    electricBill: 'Рахунок за електрику',
    gas: 'Бензин',
    webDesignProject: 'Проект веб-дизайну',
    
    // Exchange Rate
    exchangeRate: 'Курс валют',
    loading: 'Завантаження...',
  },
};

// Exchange rates - will be fetched from API
export const exchangeRates = {
  USD_TO_UAH: 41.5,
  USD_TO_EUR: 0.92,
  EUR_TO_USD: 1.09,
  UAH_TO_USD: 0.024,
  EUR_TO_UAH: 45.0,
};

export function formatCurrency(amount: number, currency: DisplayCurrency): string {
  const symbol = currency === 'USD' ? '$' : '₴';
  return `${symbol}${amount.toFixed(2)}`;
}