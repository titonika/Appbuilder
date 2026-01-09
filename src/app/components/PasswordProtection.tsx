import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Lock, Unlock, Eye, EyeOff } from "lucide-react";
import { Language, translations } from "../utils/translations";

interface PasswordProtectionProps {
  hasPassword: boolean;
  onSetPassword: (password: string) => void;
  onRemovePassword: () => void;
  language: Language;
}

export function PasswordProtection({
  hasPassword,
  onSetPassword,
  onRemovePassword,
  language,
}: PasswordProtectionProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const t = translations[language];

  const handleSetPassword = () => {
    setError("");
    
    if (!newPassword || newPassword.length < 4) {
      setError(t.passwordTooShort || "Пароль должен содержать минимум 4 символа");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t.passwordsDontMatch || "Пароли не совпадают");
      return;
    }

    onSetPassword(newPassword);
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPassword("");
    setShowDialog(false);
  };

  const handleRemovePassword = () => {
    onRemovePassword();
    setCurrentPassword("");
    setShowDialog(false);
  };

  return (
    <>
      <Button
        variant={hasPassword ? "default" : "outline"}
        size="sm"
        onClick={() => setShowDialog(true)}
        className="gap-2"
      >
        {hasPassword ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
        {hasPassword ? (t.changePassword || "Изменить пароль") : (t.setPassword || "Установить пароль")}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {hasPassword
                ? (t.changePassword || "Изменить пароль")
                : (t.setPassword || "Установить пароль")}
            </DialogTitle>
            <DialogDescription>
              {hasPassword
                ? (t.changePasswordDesc || "Измените или удалите текущий пароль")
                : (t.setPasswordDesc || "Установите пароль для защиты ваших данных")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t.newPassword || "Новый пароль"}</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t.enterPassword || "Введите пароль"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.confirmPassword || "Подтвердите пароль"}</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t.reenterPassword || "Введите пароль еще раз"}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-2">
              <Button onClick={handleSetPassword} className="flex-1">
                {t.save || "Сохранить"}
              </Button>
              {hasPassword && (
                <Button
                  variant="destructive"
                  onClick={handleRemovePassword}
                  className="flex-1"
                >
                  {t.removePassword || "Удалить пароль"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
