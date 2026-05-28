import { ArrowLeft, Sparkles, User, Bot } from "lucide-react";
import { AICommandBar } from "@/components/oikos/AICommandBar";
import { GlassCard } from "@/components/oikos/GlassCard";
import { AIAgentStatus } from "@/components/oikos/AIAgentStatus";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  agentWorking?: boolean;
  results?: Array<{ type: string; data: any }>;
}

export function AIChat({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hi! I'm your household AI assistant. I can help you manage schedules, tasks, groceries, and more. What can I help you with today?"
    }
  ]);

  const handleSubmit = (command: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: command
    };

    setMessages([...messages, newMessage]);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I'm analyzing your request and coordinating with the relevant agents...",
        agentWorking: true
      };
      setMessages(prev => [...prev, aiResponse]);

      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiResponse.id
              ? {
                  ...msg,
                  agentWorking: false,
                  content: "I've analyzed your week and found 2 scheduling conflicts. I've also optimized your grocery list based on your meal plan.",
                  results: [
                    { type: "conflicts", data: ["Monday 3pm - Soccer practice overlaps with dentist", "Wednesday 5pm - Team meeting conflicts with dinner"] },
                    { type: "grocery", data: ["Added 5 items based on recipes", "Removed 2 duplicate items"] }
                  ]
                }
              : msg
          )
        );
      }, 2000);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Sparkles className="w-6 h-6 text-accent" />
        <h2>AI Assistant</h2>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-auto pb-24">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarFallback className={message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gradient-to-br from-accent to-secondary text-white'}>
                {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </AvatarFallback>
            </Avatar>

            <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'flex justify-end' : ''}`}>
              <div className={`glass-card p-4 ${message.role === 'user' ? 'bg-gradient-to-br from-primary to-secondary text-white' : ''}`}>
                <p className="text-sm">{message.content}</p>

                {message.agentWorking && (
                  <div className="mt-4 space-y-2">
                    <AIAgentStatus agent="coordinator" status="working" message="Analyzing schedule..." />
                  </div>
                )}

                {message.results && (
                  <div className="mt-4 space-y-3">
                    {message.results.map((result, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-white/30 border border-white/20">
                        <h4 className="text-xs font-medium mb-2 uppercase text-muted-foreground">
                          {result.type}
                        </h4>
                        <ul className="text-xs space-y-1">
                          {result.data.map((item: string, i: number) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-none p-4 sticky bottom-0">
        <AICommandBar onSubmit={handleSubmit} placeholder="Ask anything..." />
      </div>
    </div>
  );
}
