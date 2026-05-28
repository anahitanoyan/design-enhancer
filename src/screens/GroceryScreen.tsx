import { ArrowLeft, Plus, ShoppingCart, Sparkles } from "lucide-react";
import { GlassCard } from "../oikos/GlassCard";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";

export function GroceryScreen({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState([
    { id: "1", name: "Whole Milk", category: "Dairy", checked: false, aiSuggested: false },
    { id: "2", name: "Whole Wheat Bread", category: "Bakery", checked: true, aiSuggested: false },
    { id: "3", name: "Organic Apples (6)", category: "Fruits", checked: false, aiSuggested: false },
    { id: "4", name: "Chicken Breast", category: "Meat", checked: false, aiSuggested: false },
    { id: "5", name: "Cherry Tomatoes", category: "Vegetables", checked: false, aiSuggested: true },
    { id: "6", name: "Greek Yogurt", category: "Dairy", checked: false, aiSuggested: true },
    { id: "7", name: "Olive Oil", category: "Pantry", checked: false, aiSuggested: false },
    { id: "8", name: "Pasta", category: "Pantry", checked: false, aiSuggested: true }
  ]);

  const categories = [...new Set(items.map(item => item.category))];
  const progress = (items.filter(i => i.checked).length / items.length) * 100;

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="min-h-screen">
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <ShoppingCart className="w-6 h-6 text-primary" />
        <h2>Grocery List</h2>
        <button className="ml-auto p-2 rounded-full bg-primary text-primary-foreground">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <GlassCard gradient="mixed" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Shopping Progress</span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {items.filter(i => !i.checked).length} items remaining
          </p>
        </GlassCard>

        <GlassCard className="p-4 bg-gradient-to-br from-accent/20 to-secondary/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="text-sm">AI Suggestions</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Based on your meal plan, I've added {items.filter(i => i.aiSuggested).length} items
          </p>
        </GlassCard>

        {categories.map(category => (
          <div key={category} className="space-y-2">
            <h3 className="text-sm text-muted-foreground px-2">{category}</h3>
            <GlassCard className="p-3 space-y-2">
              {items
                .filter(item => item.category === category)
                .map(item => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/30 cursor-pointer transition-colors"
                  >
                    <Checkbox checked={item.checked} onCheckedChange={() => toggleItem(item.id)} />
                    <span className={`flex-1 text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                      {item.name}
                    </span>
                    {item.aiSuggested && (
                      <Sparkles className="w-3 h-3 text-accent" />
                    )}
                  </label>
                ))}
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  );
}
