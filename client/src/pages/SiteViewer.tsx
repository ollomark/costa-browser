import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";

export default function SiteViewer() {
  const [, params] = useRoute("/site/:id");
  const [, setLocation] = useLocation();
  const [site, setSite] = useState<any>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (!params?.id) return;

    const stored = localStorage.getItem("pwa-browser-sites");
    if (stored) {
      try {
        const sites = JSON.parse(stored);
        const foundSite = sites.find((s: any) => s.id === params.id);
        setSite(foundSite);
      } catch (e) {
        console.error("Failed to load site", e);
      }
    }
  }, [params?.id]);

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    if (site?.url) {
      window.open(site.url, "_blank");
    }
  };

  if (!site) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Site bulunamadı</h2>
          <Button onClick={() => setLocation("/")}>Ana Sayfaya Dön</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {site.favicon && (
                <img
                  src={site.favicon}
                  alt={site.title}
                  className="w-6 h-6 flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h1 className="font-semibold truncate text-sm">{site.title}</h1>
                <p className="text-xs text-muted-foreground truncate">
                  {site.url}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleOpenExternal}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Iframe */}
      <div className="flex-1 relative">
        {iframeError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-10">
            <div className="text-center max-w-md px-4">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-xl font-semibold mb-2">Site Yüklenemedi</h2>
              <p className="text-muted-foreground mb-4">
                Bu site iframe içinde görüntülenmeyi engelliyor.
              </p>
              <Button onClick={handleOpenExternal} size="lg">
                Harici Tarayıcıda Aç
              </Button>
            </div>
          </div>
        )}
        <iframe
          key={iframeKey}
          src={site.url}
          className="w-full h-full border-0"
          title={site.title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-top-navigation allow-downloads"
          allow="geolocation; microphone; camera; payment; autoplay"
          onError={() => setIframeError(true)}
        />
      </div>
    </div>
  );
}

