import { useRef, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Upload, X } from "lucide-react";

export const isVideoUrl = (url: string) => /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url);

const uploadFile = async (file: File, path: string): Promise<string> => {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) throw new Error("Admin authentication required. Please log in again.");
  const fd = new FormData();
  fd.append("file", file);
  fd.append("bucket", "media");
  fd.append("path", path);
  const { data, error } = await supabase.functions.invoke("admin-upload", {
    body: fd,
    headers: { "x-admin-token": adminToken },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data.url || data.publicUrl;
};

export const MediaListInput = ({ value, onChange, path }: { value: string[]; onChange: (v: string[]) => void; path: string }) => {
  const [uploading, setUploading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const list = Array.isArray(value) ? value : [];

  const onFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const f of files) {
      if (f.size > 50 * 1024 * 1024) {
        toast({ title: "File too large", description: `${f.name} is over 50MB`, variant: "destructive" });
        continue;
      }
      try {
        urls.push(await uploadFile(f, path));
      } catch (err: any) {
        toast({ title: "Upload failed", description: err.message, variant: "destructive" });
      }
    }
    onChange([...list, ...urls]);
    setUploading(false);
    if (ref.current) ref.current.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {list.map((url, i) => (
          <div key={url + i} className="relative aspect-square rounded-md overflow-hidden border border-border bg-muted">
            {isVideoUrl(url) ? (
              <video src={url} className="w-full h-full object-cover" muted />
            ) : (
              <img src={url} alt="" className="w-full h-full object-cover" />
            )}
            <button
              type="button"
              onClick={() => onChange(list.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 rounded-full bg-background/90 p-1"
              aria-label="Remove"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <input ref={ref} type="file" accept="image/*,video/*" multiple className="hidden" onChange={onFiles} />
      <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => ref.current?.click()}>
        {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
        Add photos / videos
      </Button>
    </div>
  );
};

export type LinkItem = { label: string; url: string };

export const LinksInput = ({ value, onChange }: { value: LinkItem[]; onChange: (v: LinkItem[]) => void }) => {
  const list = Array.isArray(value) ? value : [];
  const update = (i: number, k: keyof LinkItem, v: string) =>
    onChange(list.map((l, j) => (j === i ? { ...l, [k]: v } : l)));
  return (
    <div className="space-y-2">
      {list.map((l, i) => (
        <div key={i} className="flex gap-2">
          <Input className="glass-input w-1/3" placeholder="Label (e.g. GitHub)" value={l.label} onChange={(e) => update(i, "label", e.target.value)} />
          <Input className="glass-input flex-1" placeholder="https://..." value={l.url} onChange={(e) => update(i, "url", e.target.value)} />
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(list.filter((_, j) => j !== i))}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...list, { label: "", url: "" }])}>
        <Plus className="h-4 w-4 mr-1" /> Add link
      </Button>
    </div>
  );
};
