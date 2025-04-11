
import { AppProvider } from "@/context/AppContext";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Dashboard from "./Dashboard";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <AppProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar />
        <main className={cn(
          "flex-1 overflow-y-auto",
          isMobile && "pl-0"
        )}>
          <Dashboard />
        </main>
      </div>
    </AppProvider>
  );
};

export default Index;
