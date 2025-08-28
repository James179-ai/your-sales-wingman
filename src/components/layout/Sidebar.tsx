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
  X
} from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/", current: false },
  { name: "Campaigns", icon: Target, href: "/campaigns", current: false },
  { name: "Prospects", icon: Users, href: "/prospects", current: false },
  { name: "Messages", icon: MessageSquare, href: "/messages", current: false },
  { name: "Activity", icon: Activity, href: "/activity", current: false },
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
      "flex flex-col h-full bg-gradient-surface border-r border-border-subtle transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-subtle">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">Closerly</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-surface-elevated"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive: navIsActive }) => cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                collapsed && "justify-center px-2",
                navIsActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
              )}
            >
              <Icon className={cn("w-5 h-5", !collapsed && "mr-3")} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border-subtle">
        <div className={cn(
          "flex items-center space-x-3",
          collapsed && "justify-center"
        )}>
           <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
             <span className="text-sm font-medium text-primary-foreground">KM</span>
           </div>
          {!collapsed && (
             <div>
               <p className="text-sm font-medium text-foreground">Karl-Martin</p>
               <p className="text-xs text-muted-foreground">Arthur's Partner</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}