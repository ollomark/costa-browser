import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";



interface AddSiteDrawerProps {
  onSiteAdded: () => void;
}

export function AddSiteDrawer({ onSiteAdded }: AddSiteDrawerProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const addSiteMutation = trpc.site.add.useMutation();

  const handleSubmit = async () => {
    if (!title || !url) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      let finalUrl = url.trim();
      if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
        finalUrl = "https://" + finalUrl;
      }
      
      const urlObj = new URL(finalUrl);
      const favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;

      const result = await addSiteMutation.mutateAsync({
        url: finalUrl,
        title: title,
        favicon: favicon,
      });

      toast.success(`${title} eklendi! ${result.notificationsSent} cihaza bildirim gönderildi.`);
      setTitle("");
      setUrl("");
      setOpen(false);
      onSiteAdded();
    } catch (error) {
      toast.error("Site eklenemedi");
      console.error(error);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni Site Ekle
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Yeni Site Ekle</DrawerTitle>
          <DrawerDescription>
            Sık kullandığınız web sitelerini ekleyerek hızlı erişim sağlayın
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-title">Site Adı</Label>
            <Input
              id="site-title"
              placeholder="Örn: Google"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="site-url">Site Adresi</Label>
            <Input
              id="site-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <DrawerFooter>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
          >
            Ekle
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">İptal</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

