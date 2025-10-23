import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Trash2, ExternalLink, Settings, Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { InstallPrompt } from "@/components/InstallPrompt";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { useLocation } from "wouter";
import { NotificationPromptOnInstall } from "@/components/NotificationPromptOnInstall";
import { AddSiteDrawer } from "@/components/AddSiteDrawer";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  
  // Fetch sites from database
  const { data: sites, refetch: refetchSites, isLoading, error } = trpc.site.list.useQuery();
  

  const deleteSiteMutation = trpc.site.delete.useMutation();
  
  // Fetch current version from database
  const { data: versionData } = trpc.version.current.useQuery();
  const currentVersion = versionData?.version || "1.7.0";
  
  // Notification count (still from localStorage for now)
  const [notificationCount, setNotificationCount] = useState(0);

  const removeSite = async (id: number) => {
    try {
      await deleteSiteMutation.mutateAsync({ id });
      toast.success("Site silindi");
      refetchSites();
    } catch (error) {
      toast.error("Site silinemedi");
    }
  };

  const openSite = (siteId: number) => {
    setLocation(`/site/${siteId}`);
  };

  const openSiteExternal = (siteUrl: string) => {
    window.open(siteUrl, "_blank");
  };

  const handleSiteAdded = () => {
    refetchSites();
  };

  return (
    <>
      <InstallPrompt />
      <OfflineIndicator />
      <NotificationPromptOnInstall />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              CostaBrowser
            </h1>
              <p className="text-xs text-muted-foreground">Web sitelerinizi uygulama gibi kullanın</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full relative"
              onClick={() => setLocation("/notifications")}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => setLocation("/settings")}
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Add Site Section */}
        <Card className="p-6 mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
          <AddSiteDrawer onSiteAdded={handleSiteAdded} />
        </Card>

        {/* Saved Sites */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              Kayıtlı Siteler
              <span className="text-sm text-muted-foreground font-normal">
                ({sites?.length || 0})
              </span>
            </h2>
          </div>

          {(!sites || sites.length === 0) ? (
            <Card className="p-12 text-center border-border/50 bg-card/30">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Henüz site eklemediniz</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Sık kullandığınız web sitelerini ekleyerek hızlı erişim sağlayın.
                Siteler native uygulama gibi açılacak.
              </p>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {(sites || []).map((site) => (
                <Card
                  key={site.id}
                  className="group hover:shadow-lg transition-all duration-200 border-border/50 bg-card/50 backdrop-blur-sm hover:border-emerald-500/30"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {site.favicon ? (
                          <img
                            src={site.favicon}
                            alt={site.title}
                            className="w-8 h-8"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <Globe className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate mb-1">{site.title}</h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {site.url}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => openSite(site.id)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                        size="sm"
                      >
                        Aç
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSiteExternal(site.url)}
                        className="hover:bg-muted"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSite(site.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Install PWA Prompt */}
        <Card className="mt-8 p-6 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Ana Ekrana Ekle</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Bu uygulamayı telefonunuzun ana ekranına ekleyerek native uygulama gibi kullanabilirsiniz.
              </p>
              <p className="text-xs text-muted-foreground">
                Tarayıcınızın menüsünden "Ana ekrana ekle" seçeneğini kullanın.
              </p>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground space-y-2">
          <p>CostaBrowser - Web sitelerinizi native uygulama gibi kullanın</p>
          <p className="text-xs flex items-center justify-center gap-2">
            <span>Versiyon {currentVersion}</span>
            <span>•</span>
            <button 
              onClick={() => setLocation("/admin")} 
              className="hover:text-foreground transition-colors"
            >
              Admin Panel
            </button>
          </p>
        </div>
      </footer>
      </div>
    </>
  );
}

