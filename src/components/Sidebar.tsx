
import { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  ReceiptText,
  PiggyBank,
  Leaf,
  Sparkles,
  Settings,
  ChevronRight,
  Menu,
  X,
  Brain
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <HomeIcon className="h-5 w-5" />,
  },
  {
    title: "Expenses",
    href: "/expenses",
    icon: <ReceiptText className="h-5 w-5" />,
  },
  {
    title: "Budget",
    href: "/budget",
    icon: <PiggyBank className="h-5 w-5" />,
  },
  {
    title: "Carbon",
    href: "/carbon",
    icon: <Leaf className="h-5 w-5" />,
  },
  {
    title: "Insights",
    href: "/insights",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    title: "Rewards",
    href: "/rewards",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

const Sidebar = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { user } = useApp();

  const Navigation = () => (
    <div className="space-y-4 py-4">
      <div className="px-4 py-2">
        <h2 className="mb-1 px-2 text-lg font-semibold tracking-tight">
          EcoBudget
        </h2>
        <div className="mb-4 px-2 text-xs text-muted-foreground">
          Smart financial planning
        </div>
        <div className="flex items-center gap-2 rounded-md bg-secondary/50 p-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
            {user.name[0]}
          </div>
          <div className="flex-1 truncate text-sm">
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">
              {user.points} points
            </div>
          </div>
        </div>
      </div>
      <div className="px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Fragment key={item.href}>
              <Link
                to={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.href ? "bg-accent" : "transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    location.pathname === item.href && "rotate-90"
                  )}
                />
              </Link>
              {item.href === "/rewards" && (
                <Separator className="my-2 hidden sm:block" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Sheet open={open} onOpenChange={setOpen}>
          <div className="flex h-16 w-full items-center justify-between border-b px-4 md:px-6">
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <div className="flex gap-2">
              <h2 className="text-lg font-semibold">
                {navItems.find((item) => item.href === location.pathname)?.title || "EcoBudget"}
              </h2>
            </div>
          </div>
          <SheetContent side="left" className="w-[240px] p-0">
            <Navigation />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <div className="hidden border-r bg-background/50 pr-0 lg:block lg:w-[240px]">
      <Navigation />
    </div>
  );
};

export default Sidebar;
