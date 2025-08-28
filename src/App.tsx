import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Campaigns from "./pages/Campaigns";
import NewCampaign from "./pages/NewCampaign";
import Messages from "./pages/Messages";
import Prospects from "./pages/Prospects";
import Settings from "./pages/Settings";
import Activity from "./pages/Activity";
import Team from "./pages/Team";
import Billing from "./pages/Billing";
import AITraining from "./pages/AITraining";
import ConversationTraining from "./pages/ConversationTraining";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/new" element={<NewCampaign />} />
          <Route path="/prospects" element={<Prospects />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/team" element={<Team />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai-training" element={<AITraining />} />
          <Route path="/ai-training/conversations" element={<ConversationTraining />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
