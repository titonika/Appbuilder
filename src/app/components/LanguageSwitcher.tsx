import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { Globe, DollarSign } from "lucide-react";
import { Language, DisplayCurrency } from "../utils/translations";

interface LanguageSwitcherProps {
  currentLanguage: Language;
  currentCurrency: DisplayCurrency;
  onLanguageChange: (language: Language) => void;
  onCurrencyChange: (currency: DisplayCurrency) => void;
}

const languageNames: Record<Language, string> = {
  en: 'English',
  ru: 'Русский',
  uk: 'Українська',
};

const currencyNames: Record<DisplayCurrency, string> = {
  USD: 'USD ($)',
  UAH: 'UAH (₴)',
};

export function LanguageSwitcher({
  currentLanguage,
  currentCurrency,
  onLanguageChange,
  onCurrencyChange,
}: LanguageSwitcherProps) {
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Globe className="h-4 w-4" />
            {languageNames[currentLanguage]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Language / Язык / Мова</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onLanguageChange('en')}>
            {languageNames.en}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onLanguageChange('ru')}>
            {languageNames.ru}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onLanguageChange('uk')}>
            {languageNames.uk}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <DollarSign className="h-4 w-4" />
            {currentCurrency}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Display Currency</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onCurrencyChange('USD')}>
            {currencyNames.USD}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCurrencyChange('UAH')}>
            {currencyNames.UAH}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
