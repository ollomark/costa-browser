import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface SavedSite {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  addedAt: number;
}

interface SiteDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSite: SavedSite | null;
  onSave: (title: string, url: string) => void;
}

export function SiteDrawer({ open, onOpenChange, editingSite, onSave }: SiteDrawerProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (editingSite) {
      setTitle(editingSite.title);
      setUrl(editingSite.url);
    } else {
      setTitle("");
      setUrl("");
    }
  }, [editingSite, open]);

  const handleSave = () => {
    if (title && url) {
      onSave(title, url);
      setTitle("");
      setUrl("");
      onOpenChange(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{editingSite ? "Site Düzenle" : "Yeni Site Ekle"}</DrawerTitle>
          <DrawerDescription>
            Site bilgilerini girin
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 space-y-4">
          <div>
            <Label htmlFor="drawer-site-title">Site Adı</Label>
            <Input
              id="drawer-site-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Google"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="drawer-site-url">Site URL</Label>
            <Input
              id="drawer-site-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-1"
            />
          </div>
        </div>

        <DrawerFooter>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            {editingSite ? "Güncelle" : "Ekle"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">İptal</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

