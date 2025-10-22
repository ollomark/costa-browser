import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, User } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple authentication (in production, use proper backend auth)
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "costa2025";

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set session
      const session = {
        username,
        loginTime: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };
      localStorage.setItem("admin-session", JSON.stringify(session));

      // Log the login
      logAdminAction("login", "Admin başarıyla giriş yaptı");

      toast.success("Giriş başarılı!");
      setLocation("/admin");
    } else {
      // Log failed attempt
      logAdminAction("login_failed", `Başarısız giriş denemesi: ${username}`);
      toast.error("Kullanıcı adı veya şifre hatalı");
    }

    setLoading(false);
  };

  const logAdminAction = (action: string, description: string) => {
    const logs = JSON.parse(localStorage.getItem("admin-logs") || "[]");
    logs.unshift({
      id: Date.now().toString(),
      action,
      description,
      timestamp: Date.now(),
      username: username || "unknown",
    });
    // Keep last 100 logs
    localStorage.setItem("admin-logs", JSON.stringify(logs.slice(0, 100)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ana Sayfaya Dön
        </Button>

        <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Admin Girişi</h1>
            <p className="text-sm text-muted-foreground">
              Yönetim paneline erişmek için giriş yapın
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Demo Bilgileri:</strong><br />
              Kullanıcı Adı: admin<br />
              Şifre: costa2025
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

