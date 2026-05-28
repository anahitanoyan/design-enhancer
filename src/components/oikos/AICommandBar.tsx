import { Send, Sparkles } from "lucide-react";
import { useState } from "react";

interface AICommandBarProps {
  onSubmit: (command: string) => void;
  placeholder?: string;
}

export function AICommandBar({ onSubmit, placeholder = "Ask AI to help..." }: AICommandBarProps) {
  const [command, setCommand] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onSubmit(command);
      setCommand("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="glass-card p-4 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-accent" />
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!command.trim()}
          className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
