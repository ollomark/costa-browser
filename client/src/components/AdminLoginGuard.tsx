import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "costa2025"; // Simple password
const ADMIN_SESSION_KEY = "admin-logged-in";

interface AdminLoginGuardProps {
  children: React.ReactNode;
}

export function AdminLoginGuard({ children }: AdminLoginGuardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if already logged in
    const loggedIn = localStorage.getItem(ADMIN_SESSION_KEY) === "true";
    setIsLoggedIn(loggedIn);
    setIsChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_SESSION_KEY, "true");
      setIsLoggedIn(true);
      toast.success("Giriş başarılı!");
    } else {
      toast.error("Hatalı şifre!");
      setPassword("");
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <Card className="w-full max-w-md p-8 border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold">Admin Girişi</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Yönetim paneline erişmek için şifre girin
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Giriş Yap
            </Button>

            <div className="text-center text-xs text-muted-foreground mt-4 p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="font-medium mb-1">Demo Bilgileri:</p>
              <p>Şifre: costa2025</p>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

