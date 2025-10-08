import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  className 
}: KPICardProps) {
  return (
    <div className={cn(
      "relative group overflow-hidden",
      "glassmorphism rounded-2xl p-6",
      "shadow-md hover:shadow-xl hover:-translate-y-1",
      "transition-all duration-300 ease-out",
      "border border-border-subtle/50",
      className
    )}>
      {/* Gradient glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2 bg-gradient-primary bg-clip-text text-transparent">{value}</p>
          {change && (
            <p className={cn(
              "text-sm mt-2 font-medium flex items-center gap-1",
              changeType === "positive" && "text-success",
              changeType === "negative" && "text-destructive",
              changeType === "neutral" && "text-muted-foreground"
            )}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-7 h-7 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}