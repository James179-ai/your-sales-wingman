import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Target, TrendingUp, Users, Calendar, MessageSquare, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const currentGoals = [
  {
    id: 1,
    title: "Monthly Response Rate",
    description: "Achieve 25% response rate this month",
    current: 23,
    target: 25,
    unit: "%",
    progress: 92,
    status: "on-track",
    deadline: "End of December 2024",
    icon: MessageSquare,
    color: "hsl(var(--chart-1))"
  },
  {
    id: 2,
    title: "Weekly Connections",
    description: "Send 150 connections per week",
    current: 132,
    target: 150,
    unit: "",
    progress: 88,
    status: "on-track",
    deadline: "Every Sunday",
    icon: Users,
    color: "hsl(var(--chart-2))"
  },
  {
    id: 3,
    title: "Monthly Meetings",
    description: "Book 40 meetings this month",
    current: 28,
    target: 40,
    unit: "",
    progress: 70,
    status: "behind",
    deadline: "End of December 2024",
    icon: Calendar,
    color: "hsl(var(--chart-3))"
  },
  {
    id: 4,
    title: "Quarterly Pipeline Value",
    description: "Generate $500K in pipeline value",
    current: 425000,
    target: 500000,
    unit: "$",
    progress: 85,
    status: "on-track",
    deadline: "End of Q4 2024",
    icon: TrendingUp,
    color: "hsl(var(--chart-4))"
  }
];

const completedGoals = [
  {
    id: 5,
    title: "November Response Rate",
    description: "Achieved 22% response rate in November",
    current: 22,
    target: 20,
    unit: "%",
    progress: 100,
    status: "completed",
    completedDate: "November 30, 2024",
    icon: MessageSquare
  },
  {
    id: 6,
    title: "Q3 Connection Target",
    description: "Sent 1,800 connections in Q3",
    current: 1850,
    target: 1800,
    unit: "",
    progress: 100,
    status: "exceeded",
    completedDate: "September 30, 2024",
    icon: Users
  }
];

const formatNumber = (num: number, unit: string) => {
  if (unit === "$" && num >= 1000) {
    return `$${(num / 1000).toFixed(0)}K`;
  }
  return `${num}${unit}`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "on-track":
      return "bg-success text-success-foreground";
    case "behind":
      return "bg-warning text-warning-foreground";
    case "completed":
      return "bg-success text-success-foreground";
    case "exceeded":
      return "bg-chart-1 text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const Goals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState(currentGoals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    unit: "",
    deadline: "",
    category: "connections"
  });

  const iconMap = {
    connections: Users,
    responses: MessageSquare,
    meetings: Calendar,
    revenue: TrendingUp
  };

  const colorMap = {
    connections: "hsl(var(--chart-1))",
    responses: "hsl(var(--chart-2))",
    meetings: "hsl(var(--chart-3))",
    revenue: "hsl(var(--chart-4))"
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal = {
      id: Math.max(...goals.map(g => g.id)) + 1,
      title: formData.title,
      description: formData.description,
      current: 0,
      target: parseInt(formData.target),
      unit: formData.unit,
      progress: 0,
      status: "on-track" as const,
      deadline: formData.deadline,
      icon: iconMap[formData.category as keyof typeof iconMap],
      color: colorMap[formData.category as keyof typeof colorMap]
    };

    setGoals(prev => [...prev, newGoal]);
    setIsDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      target: "",
      unit: "",
      deadline: "",
      category: "connections"
    });
  };

  const handleDeleteGoal = (goalId: number) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/')}
              className="shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Goals & Targets</h1>
              <p className="text-muted-foreground">
                Track Arthur's performance against your business objectives
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" className="gap-2">
                <Plus className="w-4 h-4" />
                Add New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Goal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Monthly Response Rate Target"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe what this goal aims to achieve"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target">Target Value</Label>
                    <Input
                      id="target"
                      type="number"
                      value={formData.target}
                      onChange={(e) => handleInputChange("target", e.target.value)}
                      placeholder="100"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => handleInputChange("unit", e.target.value)}
                      placeholder="%, $, or leave blank"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="connections">Connections</SelectItem>
                      <SelectItem value="responses">Responses</SelectItem>
                      <SelectItem value="meetings">Meetings</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange("deadline", e.target.value)}
                    placeholder="e.g., End of January 2025"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Create Goal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Current Goals */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Current Goals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const IconComponent = goal.icon;
              return (
                <Card key={goal.id} className="p-6 bg-gradient-glass border-border-subtle">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: goal.color, opacity: 0.1 }}
                      >
                        <IconComponent 
                          className="w-5 h-5" 
                          style={{ color: goal.color }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(goal.status)} variant="secondary">
                        {goal.status === "on-track" ? "On Track" : 
                         goal.status === "behind" ? "Behind" : goal.status}
                      </Badge>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{goal.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">
                        {formatNumber(goal.current, goal.unit)} / {formatNumber(goal.target, goal.unit)}
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Deadline: {goal.deadline}</span>
                      <span className="font-medium" style={{ color: goal.color }}>
                        {goal.progress}%
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Completed Goals */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Completed Goals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedGoals.map((goal) => {
              const IconComponent = goal.icon;
              return (
                <Card key={goal.id} className="p-6 bg-gradient-glass border-border-subtle opacity-75">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(goal.status)} variant="secondary">
                      {goal.status === "completed" ? "Completed" : "Exceeded"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Final Result</span>
                      <span className="font-medium text-foreground">
                        {formatNumber(goal.current, goal.unit)} / {formatNumber(goal.target, goal.unit)}
                      </span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Completed: {goal.completedDate}</span>
                      <span className="font-medium text-success">100%</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Performance Summary */}
        <Card className="p-6 bg-gradient-glass border-border-subtle">
          <h3 className="text-lg font-semibold text-foreground mb-4">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {goals.length > 0 ? Math.round((goals.filter(g => g.status === "on-track").length / goals.length) * 100) : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Goals on Track</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-chart-1/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-chart-1" />
              </div>
              <p className="text-2xl font-bold text-foreground">{goals.length + completedGoals.length}</p>
              <p className="text-sm text-muted-foreground">Total Goals Set</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-chart-2" />
              </div>
              <p className="text-2xl font-bold text-foreground">{completedGoals.length}</p>
              <p className="text-sm text-muted-foreground">Goals Achieved</p>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Goals;