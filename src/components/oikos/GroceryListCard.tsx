import { ShoppingCart, Plus } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

interface GroceryListCardProps {
  items: GroceryItem[];
  onToggle: (id: string) => void;
  onAdd?: () => void;
}

export function GroceryListCard({ items, onToggle, onAdd }: GroceryListCardProps) {
  const uncheckedCount = items.filter(item => !item.checked).length;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" />
          <h3>Grocery List</h3>
        </div>
        <span className="text-sm text-muted-foreground">{uncheckedCount} items</span>
      </div>

      <div className="space-y-2 mb-3">
        {items.slice(0, 5).map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/30 cursor-pointer transition-colors"
          >
            <Checkbox
              checked={item.checked}
              onCheckedChange={() => onToggle(item.id)}
            />
            <span className={`flex-1 text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
              {item.name}
            </span>
            <span className="text-xs text-muted-foreground">{item.category}</span>
          </label>
        ))}
      </div>

      {onAdd && (
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg border border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add Item</span>
        </button>
      )}
    </div>
  );
}
