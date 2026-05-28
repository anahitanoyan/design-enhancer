import { ArrowLeft, Plus, ShoppingCart, Sparkles, Loader2, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

type Item = {
  id: string;
  name: string;
  category: string;
  quantity: string | null;
  checked: boolean;
  ai_suggested: boolean;
};

const CATEGORIES = ["Dairy", "Bakery", "Fruits", "Vegetables", "Meat", "Pantry", "Drinks", "Other"];

export function GroceryScreen({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [quantity, setQuantity] = useState("");

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await (supabase.from("grocery_items") as any)
      .select("*").order("created_at", { ascending: true });
    setLoading(false);
    if (error) toast.error(error.message);
    else setItems((data ?? []) as Item[]);
  };
  useEffect(() => { load(); }, [user?.id]);

  const toggle = async (it: Item) => {
    const { error } = await (supabase.from("grocery_items") as any)
      .update({ checked: !it.checked }).eq("id", it.id);
    if (error) toast.error(error.message);
    else setItems(items.map(x => x.id === it.id ? { ...x, checked: !x.checked } : x));
  };

  const remove = async (it: Item) => {
    const { error } = await (supabase.from("grocery_items") as any).delete().eq("id", it.id);
    if (error) toast.error(error.message);
    else { toast.success("Removed"); setItems(items.filter(x => x.id !== it.id)); }
  };

  const clearChecked = async () => {
    const ids = items.filter(i => i.checked).map(i => i.id);
    if (ids.length === 0) return;
    const { error } = await (supabase.from("grocery_items") as any).delete().in("id", ids);
    if (error) toast.error(error.message);
    else { toast.success(`Cleared ${ids.length} item(s)`); load(); }
  };

  const handleAdd = async () => {
    if (!user?.id || !name.trim()) { toast.error("Name required"); return; }
    setSaving(true);
    const { error } = await (supabase.from("grocery_items") as any).insert({
      owner_id: user.id, name: name.trim(), category, quantity: quantity.trim() || null,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Item added");
    setName(""); setQuantity(""); setCategory("Other");
    setDialogOpen(false);
    load();
  };

  const grouped = CATEGORIES.filter(c => items.some(i => i.category === c));
  const progress = items.length ? (items.filter(i => i.checked).length / items.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} aria-label="Back"><ArrowLeft className="w-6 h-6" /></button>
        <ShoppingCart className="w-6 h-6 text-primary" />
        <h2>Grocery List</h2>
        <button onClick={() => setDialogOpen(true)} aria-label="Add item" className="ml-auto p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 pb-24 space-y-4">
        <GlassCard gradient="mixed" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Shopping Progress</span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">{items.filter(i => !i.checked).length} item(s) remaining</p>
            {items.some(i => i.checked) && (
              <button onClick={clearChecked} className="text-xs text-alert hover:underline">Clear checked</button>
            )}
          </div>
        </GlassCard>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-2">Your list is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">Add your first item to get started.</p>
            <Button onClick={() => setDialogOpen(true)} className="bg-gradient-to-r from-[#FF7E9D] to-[#7AB8E0] text-white">Add item</Button>
          </GlassCard>
        ) : grouped.map(cat => (
          <div key={cat} className="space-y-2">
            <h3 className="text-sm text-muted-foreground px-2">{cat}</h3>
            <GlassCard className="p-3 space-y-1">
              {items.filter(i => i.category === cat).map(it => (
                <div key={it.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/30 transition-colors group">
                  <Checkbox checked={it.checked} onCheckedChange={() => toggle(it)} />
                  <span className={`flex-1 text-sm ${it.checked ? "line-through text-muted-foreground" : ""}`}>
                    {it.name}{it.quantity ? ` · ${it.quantity}` : ""}
                  </span>
                  {it.ai_suggested && <Sparkles className="w-3 h-3 text-accent" />}
                  <button onClick={() => remove(it)} aria-label="Remove" className="opacity-0 group-hover:opacity-100 text-alert transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </GlassCard>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add grocery item</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label htmlFor="g-name">Item</Label><Input id="g-name" value={name} onChange={e=>setName(e.target.value)} placeholder="Milk" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label htmlFor="g-qty">Quantity</Label><Input id="g-qty" value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="2 L" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={saving} className="bg-gradient-to-r from-[#FF7E9D] to-[#7AB8E0] text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
