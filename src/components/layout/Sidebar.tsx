import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  MessageSquare, 
  Settings, 
  CreditCard,
  Activity,
  Menu,
  X,
  Brain
} from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/", current: false },
  { name: "Campaigns", icon: Target, href: "/campaigns", current: false },
  { name: "Prospects", icon: Users, href: "/prospects", current: false },
  { name: "Messages", icon: MessageSquare, href: "/messages", current: false },
  { name: "Activity", icon: Activity, href: "/activity", current: false },
  { name: "AI Training", icon: Brain, href: "/ai-training", current: false },
  { name: "Team", icon: Users, href: "/team", current: false },
  { name: "Billing", icon: CreditCard, href: "/billing", current: false },
  { name: "Settings", icon: Settings, href: "/settings", current: false },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className={cn(
      "flex flex-col h-full bg-gradient-surface border-r border-border-subtle/50 transition-all duration-300 shadow-lg",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border-subtle/50">
        {!collapsed && (
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-foreground">Closerly</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-surface-elevated/50 transition-colors"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive: navIsActive }) => cn(
                "relative flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 group",
                collapsed && "justify-center px-3",
                navIsActive
                  ? "bg-gradient-primary text-white shadow-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated/70"
              )}
            >
              {isActive && !collapsed && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full" />
              )}
              <Icon className={cn(
                "w-5 h-5 transition-transform group-hover:scale-110", 
                !collapsed && "mr-3"
              )} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-5 border-t border-border-subtle/50">
        <div className={cn(
          "flex items-center space-x-3 p-3 rounded-xl bg-surface-elevated/50 hover:bg-surface-elevated transition-colors",
          collapsed && "justify-center p-2"
        )}>
           <div className="relative w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-md">
             <span className="text-sm font-bold text-white">KM</span>
             <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-background" />
           </div>
          {!collapsed && (
             <div className="animate-fade-in">
               <p className="text-sm font-bold text-foreground">Karl-Martin</p>
               <p className="text-xs text-muted-foreground font-medium">Arthur's Boss</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}