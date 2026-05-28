import { ArrowLeft, Plus, ShoppingCart, Sparkles, Share2, Download, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/oikos/StatusBadge";
import { useState } from "react";

interface GroceryItem {
  id: string;
  name: string;
  quantity?: string;
  category: string;
  checked: boolean;
  aiSuggested: boolean;
  price?: number;
}

export function DetailedGroceryScreen({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<GroceryItem[]>([
    { id: "1", name: "Whole Milk", quantity: "1 gal", category: "Dairy", checked: false, aiSuggested: false, price: 4.99 },
    { id: "2", name: "Whole Wheat Bread", quantity: "1 loaf", category: "Bakery", checked: true, aiSuggested: false, price: 3.49 },
    { id: "3", name: "Organic Apples", quantity: "6 ct", category: "Fruits", checked: false, aiSuggested: false, price: 5.99 },
    { id: "4", name: "Chicken Breast", quantity: "2 lbs", category: "Meat", checked: false, aiSuggested: false, price: 12.99 },
    { id: "5", name: "Cherry Tomatoes", quantity: "1 pint", category: "Vegetables", checked: false, aiSuggested: true, price: 3.99 },
    { id: "6", name: "Greek Yogurt", quantity: "32 oz", category: "Dairy", checked: false, aiSuggested: true, price: 6.49 },
    { id: "7", name: "Olive Oil", quantity: "16 oz", category: "Pantry", checked: false, aiSuggested: false, price: 8.99 },
    { id: "8", name: "Pasta", quantity: "1 lb", category: "Pantry", checked: false, aiSuggested: true, price: 2.49 },
    { id: "9", name: "Bananas", quantity: "5 ct", category: "Fruits", checked: false, aiSuggested: false, price: 1.99 },
    { id: "10", name: "Cheddar Cheese", quantity: "8 oz", category: "Dairy", checked: false, aiSuggested: true, price: 4.99 },
    { id: "11", name: "Spinach", quantity: "1 bunch", category: "Vegetables", checked: false, aiSuggested: false, price: 2.99 },
    { id: "12", name: "Rice", quantity: "2 lbs", category: "Pantry", checked: false, aiSuggested: true, price: 4.49 }
  ]);

  const categories = [...new Set(items.map(item => item.category))];
  const progress = (items.filter(i => i.checked).length / items.length) * 100;
  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const aiSuggestedCount = items.filter(i => i.aiSuggested).length;

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF5F0] via-[#E8F4F8] to-[#F0F8FF]">
      {/* Header */}
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <ShoppingCart className="w-6 h-6 text-primary" />
        <h2>Grocery List</h2>
        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 rounded-xl bg-white/30 hover:bg-white/50 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-primary text-primary-foreground">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 pb-24 space-y-4">
        {/* Shopping Stats */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Shopping Progress</span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-xl font-semibold text-primary mb-1">{items.length}</div>
              <div className="text-xs text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-success mb-1">{items.filter(i => i.checked).length}</div>
              <div className="text-xs text-muted-foreground">Collected</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-warning mb-1">${totalPrice.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Est. Total</div>
            </div>
          </div>
        </GlassCard>

        {/* AI Insights */}
        <GlassCard className="p-4 bg-gradient-to-br from-accent/20 to-secondary/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-medium">AI Shopping Assistant</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Based on your meal plan for this week, I've added {aiSuggestedCount} items. You can save 15% by shopping at Whole Foods this week.
          </p>
          <div className="flex gap-2 flex-wrap">
            <StatusBadge variant="info">{aiSuggestedCount} AI Suggestions</StatusBadge>
            <StatusBadge variant="success">15% Savings Available</StatusBadge>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="glass-card p-3 flex items-center justify-center gap-2 hover:bg-white/50 transition-colors">
            <Download className="w-4 h-4 text-primary" />
            <span className="text-sm">Export List</span>
          </button>
          <button className="glass-card p-3 flex items-center justify-center gap-2 hover:bg-white/50 transition-colors">
            <Trash2 className="w-4 h-4 text-alert" />
            <span className="text-sm">Clear Checked</span>
          </button>
        </div>

        {/* View Tabs */}
        <Tabs defaultValue="category" className="w-full">
          <TabsList className="glass-card w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="all">All Items</TabsTrigger>
          </TabsList>

          {/* By Category */}
          <TabsContent value="category" className="space-y-4">
            {categories.map(category => {
              const categoryItems = items.filter(item => item.category === category);
              const checkedInCategory = categoryItems.filter(i => i.checked).length;

              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
                    <span className="text-xs text-muted-foreground">
                      {checkedInCategory}/{categoryItems.length}
                    </span>
                  </div>
                  <GlassCard className="p-3 space-y-2">
                    {categoryItems.map(item => (
                      <label
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/30 cursor-pointer transition-colors group"
                      >
                        <Checkbox checked={item.checked} onCheckedChange={() => toggleItem(item.id)} />
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                            {item.name}
                          </div>
                          {item.quantity && (
                            <div className="text-xs text-muted-foreground">{item.quantity}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {item.aiSuggested && (
                            <Sparkles className="w-3 h-3 text-accent" />
                          )}
                          {item.price && (
                            <span className="text-xs text-muted-foreground">${item.price.toFixed(2)}</span>
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              deleteItem(item.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          >
                            <Trash2 className="w-3 h-3 text-alert" />
                          </button>
                        </div>
                      </label>
                    ))}
                  </GlassCard>
                </div>
              );
            })}
          </TabsContent>

          {/* All Items */}
          <TabsContent value="all" className="space-y-2">
            <GlassCard className="p-3 space-y-2">
              {items.map(item => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/30 cursor-pointer transition-colors group"
                >
                  <Checkbox checked={item.checked} onCheckedChange={() => toggleItem(item.id)} />
                  <div className="flex-1">
                    <div className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                      {item.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.quantity} • {item.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.aiSuggested && (
                      <Sparkles className="w-3 h-3 text-accent" />
                    )}
                    {item.price && (
                      <span className="text-xs">${item.price.toFixed(2)}</span>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteItem(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <Trash2 className="w-3 h-3 text-alert" />
                    </button>
                  </div>
                </label>
              ))}
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
