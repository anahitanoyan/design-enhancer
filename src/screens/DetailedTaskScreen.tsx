import { ArrowLeft, Plus, CheckSquare, Filter, Search, Calendar, User, Flag } from "lucide-react";
import { TaskCard } from "../oikos/TaskCard";
import { GlassCard } from "../oikos/GlassCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { StatusBadge } from "../oikos/StatusBadge";
import { Input } from "../ui/input";
import { useState } from "react";

export function DetailedTaskScreen({ onBack }: { onBack: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<"all" | "high" | "medium" | "low">("all");

  const tasks = {
    todo: [
      {
        id: "1",
        title: "Clean garage",
        assignee: { name: "John Doe" },
        dueDate: "Apr 22",
        priority: "medium" as const,
        category: "Home",
        description: "Organize tools and clean floor"
      },
      {
        id: "2",
        title: "Buy birthday gift for Sarah",
        assignee: { name: "Jane Doe" },
        dueDate: "Apr 23",
        priority: "high" as const,
        category: "Personal",
        description: "Budget: $50, check wish list"
      },
      {
        id: "3",
        title: "Schedule dentist appointment",
        assignee: { name: "Sarah Doe" },
        dueDate: "Apr 25",
        priority: "low" as const,
        category: "Health",
        description: "6-month checkup"
      },
      {
        id: "4",
        title: "Fix leaky faucet",
        assignee: { name: "John Doe" },
        dueDate: "Apr 24",
        priority: "high" as const,
        category: "Home",
        description: "Kitchen sink needs new washer"
      },
      {
        id: "5",
        title: "Plan weekend trip",
        assignee: { name: "Jane Doe" },
        dueDate: "Apr 26",
        priority: "low" as const,
        category: "Personal",
        description: "Research destinations and book hotel"
      }
    ],
    inProgress: [
      {
        id: "6",
        title: "Meal prep for week",
        assignee: { name: "Jane Doe" },
        dueDate: "Apr 21",
        priority: "high" as const,
        category: "Food",
        description: "Prepare 5 dinners"
      },
      {
        id: "7",
        title: "Paint bedroom",
        assignee: { name: "John Doe" },
        dueDate: "Apr 23",
        priority: "medium" as const,
        category: "Home",
        description: "Second coat needed"
      }
    ],
    done: [
      {
        id: "8",
        title: "Grocery shopping",
        assignee: { name: "John Doe" },
        dueDate: "Apr 20",
        priority: "medium" as const,
        category: "Food",
        completed: true
      },
      {
        id: "9",
        title: "Water plants",
        assignee: { name: "Mike Doe" },
        dueDate: "Apr 20",
        priority: "low" as const,
        category: "Home",
        completed: true
      },
      {
        id: "10",
        title: "Submit expense report",
        assignee: { name: "Jane Doe" },
        dueDate: "Apr 19",
        priority: "high" as const,
        category: "Work",
        completed: true
      }
    ]
  };

  const taskStats = {
    total: tasks.todo.length + tasks.inProgress.length + tasks.done.length,
    completed: tasks.done.length,
    overdue: 2,
    highPriority: [...tasks.todo, ...tasks.inProgress].filter(t => t.priority === "high").length
  };

  const filterTasks = (taskList: any[]) => {
    let filtered = taskList;

    if (filterBy !== "all") {
      filtered = filtered.filter(t => t.priority === filterBy);
    }

    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF5F0] via-[#E8F4F8] to-[#F0F8FF]">
      {/* Header */}
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

      <div className="flex-1 overflow-auto p-4 pb-24 space-y-4">
        {/* Task Statistics */}
        <GlassCard className="p-4">
          <h3 className="mb-4">Overview</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/30">
              <div className="text-2xl font-semibold text-primary mb-1">{taskStats.total}</div>
              <div className="text-xs text-muted-foreground">Total Tasks</div>
            </div>
            <div className="p-3 rounded-xl bg-white/30">
              <div className="text-2xl font-semibold text-success mb-1">{taskStats.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="p-3 rounded-xl bg-white/30">
              <div className="text-2xl font-semibold text-alert mb-1">{taskStats.overdue}</div>
              <div className="text-xs text-muted-foreground">Overdue</div>
            </div>
            <div className="p-3 rounded-xl bg-white/30">
              <div className="text-2xl font-semibold text-warning mb-1">{taskStats.highPriority}</div>
              <div className="text-xs text-muted-foreground">High Priority</div>
            </div>
          </div>
        </GlassCard>

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="glass-card p-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterBy("all")}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                filterBy === "all"
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-card'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterBy("high")}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                filterBy === "high"
                  ? 'bg-alert text-white'
                  : 'glass-card'
              }`}
            >
              High Priority
            </button>
            <button
              onClick={() => setFilterBy("medium")}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                filterBy === "medium"
                  ? 'bg-warning text-white'
                  : 'glass-card'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setFilterBy("low")}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all ${
                filterBy === "low"
                  ? 'bg-success text-white'
                  : 'glass-card'
              }`}
            >
              Low Priority
            </button>
          </div>
        </div>

        {/* Task Lists */}
        <Tabs defaultValue="todo" className="w-full">
          <TabsList className="glass-card w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="todo">
              To Do <span className="ml-1 text-xs">({filterTasks(tasks.todo).length})</span>
            </TabsTrigger>
            <TabsTrigger value="inProgress">
              In Progress <span className="ml-1 text-xs">({filterTasks(tasks.inProgress).length})</span>
            </TabsTrigger>
            <TabsTrigger value="done">
              Done <span className="ml-1 text-xs">({filterTasks(tasks.done).length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todo" className="space-y-3">
            {filterTasks(tasks.todo).length === 0 ? (
              <GlassCard className="p-8 text-center">
                <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No tasks found</p>
              </GlassCard>
            ) : (
              filterTasks(tasks.todo).map(task => (
                <TaskCard key={task.id} {...task} />
              ))
            )}
          </TabsContent>

          <TabsContent value="inProgress" className="space-y-3">
            {filterTasks(tasks.inProgress).length === 0 ? (
              <GlassCard className="p-8 text-center">
                <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No tasks in progress</p>
              </GlassCard>
            ) : (
              filterTasks(tasks.inProgress).map(task => (
                <TaskCard key={task.id} {...task} />
              ))
            )}
          </TabsContent>

          <TabsContent value="done" className="space-y-3">
            {filterTasks(tasks.done).length === 0 ? (
              <GlassCard className="p-8 text-center">
                <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">No completed tasks</p>
              </GlassCard>
            ) : (
              filterTasks(tasks.done).map(task => (
                <TaskCard key={task.id} {...task} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
