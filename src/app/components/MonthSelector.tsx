import { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Calendar, ChevronLeft, ChevronRight, History, Plus } from "lucide-react";
import { Language, translations } from "../utils/translations";
import { ThemeConfig } from "./ThemeSwitcher";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface MonthSelectorProps {
  currentMonth: string;
  availableMonths: string[];
  onMonthChange: (month: string) => void;
  onCreateMonth?: (monthKey: string) => void;
  language: Language;
  theme?: ThemeConfig;
}

export function MonthSelector({
  currentMonth,
  availableMonths,
  onMonthChange,
  onCreateMonth,
  language,
  theme,
}: MonthSelectorProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showCreateMonth, setShowCreateMonth] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonthNum, setSelectedMonthNum] = useState("1");
  const t = translations[language];

  const formatMonthDisplay = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    
    const monthNames = {
      en: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ],
      ru: [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
      ],
      uk: [
        "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
        "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
      ],
    };

    const monthName = monthNames[language][date.getMonth()];
    return `${monthName} ${year}`;
  };

  const currentIndex = availableMonths.indexOf(currentMonth);

  const goToPreviousMonth = () => {
    if (currentIndex > 0) {
      onMonthChange(availableMonths[currentIndex - 1]);
    }
  };

  const goToNextMonth = () => {
    if (currentIndex < availableMonths.length - 1) {
      onMonthChange(availableMonths[currentIndex + 1]);
    }
  };

  const isCurrentMonth = currentMonth === availableMonths[availableMonths.length - 1];

  const isDark = theme?.mode === 'dark';
  const containerStyles = theme ? {
    backgroundColor: theme.cardColor,
    color: theme.textColor,
  } : {};

  return (
    <>
      <div className="flex items-center gap-2 rounded-lg shadow-sm p-2" style={containerStyles}>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousMonth}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 px-4">
          <Calendar className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-muted-foreground'}`} />
          <span className="font-semibold min-w-[150px] text-center">
            {formatMonthDisplay(currentMonth)}
          </span>
          {!isCurrentMonth && (
            <span className={`text-xs px-2 py-1 rounded ${
              isDark 
                ? 'bg-orange-900 text-orange-200' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {t.history || "История"}
            </span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextMonth}
          disabled={currentIndex === availableMonths.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistory(true)}
          className="ml-2"
        >
          <History className="h-4 w-4 mr-2" />
          {t.viewHistory || "История"}
        </Button>
      </div>

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.selectMonth || "Выбрать месяц"}</DialogTitle>
            <DialogDescription>
              {t.selectMonthDesc || "Выберите месяц для просмотра или редактирования"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Select value={currentMonth} onValueChange={(value) => {
              onMonthChange(value);
              setShowHistory(false);
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {formatMonthDisplay(month)}
                    {month === availableMonths[availableMonths.length - 1] && (
                      <span className="ml-2 text-xs text-green-600">
                        ({t.current || "Текущий"})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => {
                setShowHistory(false);
                setShowCreateMonth(true);
              }} 
              variant="outline" 
              className="w-full mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.createNewMonth || "Создать новый месяц"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create New Month Dialog */}
      <Dialog open={showCreateMonth} onOpenChange={setShowCreateMonth}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.createNewMonth || "Создать новый месяц"}</DialogTitle>
            <DialogDescription>
              {t.createMonthDesc || "Создайте месяц для добавления данных за прошлый период"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="year">{t.year || "Год"}</Label>
              <Input
                id="year"
                type="number"
                min="2000"
                max="2100"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="month">{t.month || "Месяц"}</Label>
              <Select value={selectedMonthNum} onValueChange={setSelectedMonthNum}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const monthNum = (i + 1).toString();
                    const monthKey = `${selectedYear}-${monthNum.padStart(2, '0')}`;
                    const monthNames = {
                      en: ["January", "February", "March", "April", "May", "June",
                           "July", "August", "September", "October", "November", "December"],
                      ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                           "Июль", "Август", "Сентябрь", "О��тябрь", "Ноябрь", "Декабрь"],
                      uk: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
                           "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
                    };
                    const isDisabled = availableMonths.includes(monthKey);
                    
                    return (
                      <SelectItem 
                        key={monthNum} 
                        value={monthNum}
                        disabled={isDisabled}
                      >
                        {monthNames[language][i]}
                        {isDisabled && " (уже существует)"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  const monthKey = `${selectedYear}-${selectedMonthNum.padStart(2, '0')}`;
                  if (!availableMonths.includes(monthKey) && onCreateMonth) {
                    onCreateMonth(monthKey);
                    onMonthChange(monthKey);
                    setShowCreateMonth(false);
                  }
                }}
                className="flex-1"
              >
                {t.create || "Создать"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateMonth(false)}
                className="flex-1"
              >
                {t.cancel || "Отмена"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}