
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AppProvider } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Budget from "./pages/Budget";
import Carbon from "./pages/Carbon";
import Rewards from "./pages/Rewards";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import { useIsMobile } from "./hooks/use-mobile";
import { cn } from "./lib/utils";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <AppProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <main className={cn(
          "flex-1 overflow-y-auto",
          isMobile && "pl-0"
        )}>
          {children}
        </main>
      </div>
    </AppProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
          <Route path="/expenses" element={
            <AppLayout>
              <Expenses />
            </AppLayout>
          } />
          <Route path="/budget" element={
            <AppLayout>
              <Budget />
            </AppLayout>
          } />
          <Route path="/carbon" element={
            <AppLayout>
              <Carbon />
            </AppLayout>
          } />
          <Route path="/rewards" element={
            <AppLayout>
              <Rewards />
            </AppLayout>
          } />
          <Route path="/settings" element={
            <AppLayout>
              <Settings />
            </AppLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
