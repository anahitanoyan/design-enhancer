import { ArrowLeft, Plus, CheckSquare } from "lucide-react";
import { TaskCard } from "@/components/oikos/TaskCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TaskBoardScreen({ onBack }: { onBack: () => void }) {
  const tasks = {
    todo: [
      {
        id: "1",
        title: "Clean garage",
        assignee: { name: "John Doe" },
        dueDate: "Apr 22",
        priority: "medium" as const,
        category: "Home"
      },
      {
        id: "2",
        title: "Buy birthday gift",
        assignee: { name: "Jane Doe" },
        dueDate: "Apr 23",
        priority: "high" as const,
        category: "Personal"
      },
      {
        id: "3",
        title: "Schedule dentist",
        assignee: { name: "Sarah Doe" },
        dueDate: "Apr 25",
        priority: "low" as const,
        category: "Health"
      }
    ],
    inProgress: [
      {
        id: "4",
        title: "Meal prep for week",
        assignee: { name: "Jane Doe" },
        dueDate: "Apr 21",
        priority: "high" as const,
        category: "Food"
      }
    ],
    done: [
      {
        id: "5",
        title: "Grocery shopping",
        assignee: { name: "John Doe" },
        dueDate: "Apr 20",
        priority: "medium" as const,
        category: "Food",
        completed: true
      },
      {
        id: "6",
        title: "Water plants",
        assignee: { name: "Mike Doe" },
        dueDate: "Apr 20",
        priority: "low" as const,
        category: "Home",
        completed: true
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <div className="glass-card rounded-none p-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <CheckSquare className="w-6 h-6 text-secondary" />
        <h2>Tasks</h2>
        <button className="ml-auto p-2 rounded-full bg-primary text-primary-foreground">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <Tabs defaultValue="todo" className="w-full">
          <TabsList className="glass-card w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="todo">To Do ({tasks.todo.length})</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress ({tasks.inProgress.length})</TabsTrigger>
            <TabsTrigger value="done">Done ({tasks.done.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="todo" className="space-y-3">
            {tasks.todo.map(task => (
              <TaskCard key={task.id} {...task} />
            ))}
          </TabsContent>

          <TabsContent value="inProgress" className="space-y-3">
            {tasks.inProgress.map(task => (
              <TaskCard key={task.id} {...task} />
            ))}
          </TabsContent>

          <TabsContent value="done" className="space-y-3">
            {tasks.done.map(task => (
              <TaskCard key={task.id} {...task} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
