import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Language, translations } from "../utils/translations";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface GoogleSheetsSyncProps {
  monthHistory: any;
  onImportData: (data: any) => void;
  language: Language;
}

export function GoogleSheetsSync({
  monthHistory,
  onImportData,
  language,
}: GoogleSheetsSyncProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState(
    localStorage.getItem("googleSheets_spreadsheetId") || ""
  );
  const [accessToken, setAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const t = translations[language];

  const handleExport = async () => {
    if (!accessToken || !spreadsheetId) {
      setError(
        language === 'en' 
          ? "Please enter both Access Token and Spreadsheet ID" 
          : language === 'uk'
          ? "Будь ласка, введіть токен доступу та ID таблиці"
          : "Пожалуйста, введите токен доступа и ID таблицы"
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96e43c16/export-to-sheets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            accessToken,
            spreadsheetId,
            data: { monthHistory },
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setSuccess(
          language === 'en'
            ? `✓ Exported ${result.transactionsCount} transactions, ${result.monthsCount} months`
            : language === 'uk'
            ? `✓ Експортовано ${result.transactionsCount} транзакцій, ${result.monthsCount} місяців`
            : `✓ Экспортировано ${result.transactionsCount} транзакций, ${result.monthsCount} месяцев`
        );
        localStorage.setItem("googleSheets_spreadsheetId", spreadsheetId);
      } else {
        setError(result.error || "Export failed");
      }
    } catch (err: any) {
      setError(
        language === 'en'
          ? `Network error: ${err.message}`
          : language === 'uk'
          ? `Помилка мережі: ${err.message}`
          : `Ошибка сети: ${err.message}`
      );
      console.error("Export error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!accessToken || !spreadsheetId) {
      setError(
        language === 'en' 
          ? "Please enter both Access Token and Spreadsheet ID" 
          : language === 'uk'
          ? "Будь ласка, введіть токен доступу та ID таблиці"
          : "Пожалуйста, введите токен доступа и ID таблицы"
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96e43c16/import-from-sheets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            accessToken,
            spreadsheetId,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        onImportData(result.monthHistory);
        setSuccess(
          language === 'en'
            ? "✓ Data imported successfully!"
            : language === 'uk'
            ? "✓ Дані успішно імпортовано!"
            : "✓ Данные успешно импортированы!"
        );
        localStorage.setItem("googleSheets_spreadsheetId", spreadsheetId);
        setTimeout(() => setShowDialog(false), 2000);
      } else {
        setError(result.error || "Import failed");
      }
    } catch (err: any) {
      setError(
        language === 'en'
          ? `Network error: ${err.message}`
          : language === 'uk'
          ? `Помилка мережі: ${err.message}`
          : `Ошибка сети: ${err.message}`
      );
      console.error("Import error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getInstructions = () => {
    if (language === 'en') {
      return (
        <div className="text-sm space-y-3 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Quick Setup:</h4>
              <ol className="list-decimal ml-4 space-y-1.5 text-blue-800 dark:text-blue-200">
                <li>Go to <a href="https://console.cloud.google.com" target="_blank" className="underline">Google Cloud Console</a></li>
                <li>Create project → Enable "Google Sheets API"</li>
                <li>Create OAuth 2.0 Client ID (Web application)</li>
                <li>Get Access Token via OAuth Playground or your app</li>
                <li>Create Google Sheet with tabs: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Transactions</code> and <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Balances</code></li>
                <li>Copy Spreadsheet ID from URL</li>
              </ol>
            </div>
          </div>
        </div>
      );
    } else if (language === 'uk') {
      return (
        <div className="text-sm space-y-3 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Швидке налаштування:</h4>
              <ol className="list-decimal ml-4 space-y-1.5 text-blue-800 dark:text-blue-200">
                <li>Перейдіть до <a href="https://console.cloud.google.com" target="_blank" className="underline">Google Cloud Console</a></li>
                <li>Створіть проект → Увімкніть "Google Sheets API"</li>
                <li>Створіть OAuth 2.0 Client ID (веб-додаток)</li>
                <li>Отримайте Access Token через OAuth Playground</li>
                <li>Створіть Google таблицю з аркушами: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Transactions</code> та <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Balances</code></li>
                <li>Скопіюйте ID таблиці з URL</li>
              </ol>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-sm space-y-3 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Быстрая настройка:</h4>
              <ol className="list-decimal ml-4 space-y-1.5 text-blue-800 dark:text-blue-200">
                <li>Перейдите в <a href="https://console.cloud.google.com" target="_blank" className="underline">Google Cloud Console</a></li>
                <li>Создайте проект → Включите "Google Sheets API"</li>
                <li>Создайте OAuth 2.0 Client ID (веб-приложение)</li>
                <li>Получите Access Token через OAuth Playground</li>
                <li>Создайте Google таблицу с листами: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Transactions</code> и <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">Balances</code></li>
                <li>Скопируйте ID таблицы из URL</li>
              </ol>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowDialog(true)}
        className="gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        {t.googleSheets || "Google Sheets"}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === 'en' 
                ? "Google Sheets Backup" 
                : language === 'uk'
                ? "Резервна копія Google Sheets"
                : "Резервная копия Google Sheets"}
            </DialogTitle>
            <DialogDescription>
              {language === 'en'
                ? "Export or import your financial data"
                : language === 'uk'
                ? "Експортуйте або імпортуйте ваші фінансові дані"
                : "Экспортируйте или импортируйте ваши финансовые данные"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {getInstructions()}

            <div className="space-y-3">
              <div>
                <Label htmlFor="spreadsheetId" className="flex items-center gap-2">
                  {language === 'en' 
                    ? "Spreadsheet ID" 
                    : language === 'uk'
                    ? "ID таблиці"
                    : "ID таблицы"}
                  <span className="text-xs text-gray-500">
                    ({language === 'en' ? "from URL" : language === 'uk' ? "з URL" : "из URL"})
                  </span>
                </Label>
                <Input
                  id="spreadsheetId"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="accessToken" className="flex items-center gap-2">
                  {language === 'en' 
                    ? "Access Token" 
                    : language === 'uk'
                    ? "Токен доступу"
                    : "Токен доступа"}
                  <span className="text-xs text-gray-500">
                    ({language === 'en' ? "OAuth 2.0" : "OAuth 2.0"})
                  </span>
                </Label>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="ya29.a0AfH6SMB..."
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800 dark:text-red-200 break-words">{error}</div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800 dark:text-green-200">{success}</div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleExport}
                disabled={isLoading}
                className="flex-1 gap-2"
              >
                <Upload className="h-4 w-4" />
                {isLoading && language === 'en' ? "Exporting..." : isLoading && language === 'uk' ? "Експорт..." : isLoading ? "Экспорт..." : language === 'en' ? "Export" : language === 'uk' ? "Експорт" : "Экспорт"}
              </Button>
              <Button
                onClick={handleImport}
                disabled={isLoading}
                variant="secondary"
                className="flex-1 gap-2"
              >
                <Download className="h-4 w-4" />
                {isLoading && language === 'en' ? "Importing..." : isLoading && language === 'uk' ? "Імпорт..." : isLoading ? "Импорт..." : language === 'en' ? "Import" : language === 'uk' ? "Імпорт" : "Импорт"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}