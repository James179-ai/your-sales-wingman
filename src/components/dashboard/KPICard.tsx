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
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{title}</p>
            <p className="text-4xl font-bold text-foreground bg-gradient-primary bg-clip-text text-transparent">{value}</p>
          </div>
          {Icon && (
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>
        {change && (
          <div className={cn(
            "text-sm font-medium",
            changeType === "positive" && "text-success",
            changeType === "negative" && "text-destructive",
            changeType === "neutral" && "text-muted-foreground"
          )}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
}