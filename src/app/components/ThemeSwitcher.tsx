import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Moon, Sun, Wrench } from "lucide-react";
import { Language, translations } from "../utils/translations";

export type ThemeMode = "light" | "dark" | "custom";

interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  portfolioCardColor?: string;
}

interface ThemeSwitcherProps {
  currentTheme: ThemeConfig;
  onThemeChange: (theme: ThemeConfig) => void;
  language: Language;
}

export function ThemeSwitcher({ currentTheme, onThemeChange, language }: ThemeSwitcherProps) {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customConfig, setCustomConfig] = useState(currentTheme);
  const t = translations[language];

  const themePresets: Record<ThemeMode, ThemeConfig> = {
    light: {
      mode: "light",
      primaryColor: "#0ea5e9",
      backgroundColor: "#f8fafc",
      cardColor: "#ffffff",
      textColor: "#0f172a",
      portfolioCardColor: "linear-gradient(to bottom right, #9333ea, #2563eb)",
    },
    dark: {
      mode: "dark",
      primaryColor: "#38bdf8",
      backgroundColor: "#0f172a",
      cardColor: "#1e293b",
      textColor: "#f1f5f9",
      portfolioCardColor: "linear-gradient(to bottom right, #7c3aed, #1d4ed8)",
    },
    custom: currentTheme.mode === "custom" ? currentTheme : {
      mode: "custom",
      primaryColor: "#0ea5e9",
      backgroundColor: "#f8fafc",
      cardColor: "#ffffff",
      textColor: "#0f172a",
      portfolioCardColor: "linear-gradient(to bottom right, #9333ea, #2563eb)",
    },
  };

  const applyTheme = (theme: ThemeConfig) => {
    onThemeChange(theme);
    setCustomConfig(theme);
  };

  const saveCustomTheme = () => {
    applyTheme(customConfig);
    setShowCustomizer(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant={currentTheme.mode === "light" ? "default" : "outline"}
          size="icon"
          onClick={() => applyTheme(themePresets.light)}
          title={t.lightTheme || "Светлая тема"}
        >
          <Sun className="h-4 w-4" />
        </Button>
        <Button
          variant={currentTheme.mode === "dark" ? "default" : "outline"}
          size="icon"
          onClick={() => applyTheme(themePresets.dark)}
          title={t.darkTheme || "Темная тема"}
        >
          <Moon className="h-4 w-4" />
        </Button>
        <Button
          variant={currentTheme.mode === "custom" ? "default" : "outline"}
          size="icon"
          onClick={() => setShowCustomizer(true)}
          title={t.customTheme || "Настроить тему"}
        >
          <Wrench className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={showCustomizer} onOpenChange={setShowCustomizer}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.customizeTheme || "Настройка темы"}</DialogTitle>
            <DialogDescription>
              {t.customizeThemeDesc || "Настройте цвета интерфейса под свои предпочтения"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.baseTheme || "Базовая тема"}</Label>
              <Select
                value={customConfig.mode === "custom" ? "dark" : customConfig.mode}
                onValueChange={(value: "light" | "dark") => {
                  setCustomConfig({ ...themePresets[value], mode: "custom" });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t.light || "Светлая"}</SelectItem>
                  <SelectItem value="dark">{t.dark || "Темная"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryColor">{t.primaryColor || "Основной цвет"}</Label>
              <div className="flex gap-2">
                <input
                  id="primaryColor"
                  type="color"
                  value={customConfig.primaryColor}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, primaryColor: e.target.value })
                  }
                  className="h-10 w-20 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={customConfig.primaryColor}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, primaryColor: e.target.value })
                  }
                  className="flex-1 h-10 rounded border px-3"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">{t.backgroundColor || "Цвет фона"}</Label>
              <div className="flex gap-2">
                <input
                  id="backgroundColor"
                  type="color"
                  value={customConfig.backgroundColor}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, backgroundColor: e.target.value })
                  }
                  className="h-10 w-20 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={customConfig.backgroundColor}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, backgroundColor: e.target.value })
                  }
                  className="flex-1 h-10 rounded border px-3"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardColor">{t.cardColor || "Цвет карточек"}</Label>
              <div className="flex gap-2">
                <input
                  id="cardColor"
                  type="color"
                  value={customConfig.cardColor}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, cardColor: e.target.value })
                  }
                  className="h-10 w-20 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={customConfig.cardColor}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, cardColor: e.target.value })
                  }
                  className="flex-1 h-10 rounded border px-3"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textColor">{t.textColor || "Цвет текста"}</Label>
              <div className="flex gap-2">
                <input
                  id="textColor"
                  type="color"
                  value={customConfig.textColor}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, textColor: e.target.value })
                  }
                  className="h-10 w-20 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={customConfig.textColor}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, textColor: e.target.value })
                  }
                  className="flex-1 h-10 rounded border px-3"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolioCardColor">{t.portfolioCardColor || "Цвет карточки портфеля"}</Label>
              <input
                id="portfolioCardColor"
                type="text"
                value={customConfig.portfolioCardColor || ""}
                onChange={(e) =>
                  setCustomConfig({ ...customConfig, portfolioCardColor: e.target.value })
                }
                placeholder="linear-gradient(to bottom right, #9333ea, #2563eb)"
                className="w-full h-10 rounded border px-3"
              />
              <p className="text-xs text-muted-foreground">
                {language === 'en' 
                  ? 'CSS background value (gradient, color, etc.)' 
                  : 'CSS значение фона (градиент, цвет и т.д.)'}
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={saveCustomTheme} className="flex-1">
                {t.apply || "Применить"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCustomizer(false)}
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