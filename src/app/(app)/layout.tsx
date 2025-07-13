
"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MainSidebar } from "@/components/main-sidebar";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings } from "lucide-react";
import { navItems } from "@/components/main-sidebar";

function AppHeader() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  const getPageTitle = () => {
    const currentNavItem = navItems.find((item) => {
        if (item.href === "/dashboard") return pathname === item.href;
        return pathname.startsWith(item.href);
    });
    return currentNavItem ? currentNavItem.label : "Dashboard";
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-black/10 bg-white/80 backdrop-blur-lg px-4 sm:px-6">
      <div className="flex items-center gap-2">
          {isMobile && <SidebarTrigger className="text-foreground"/>}
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{getPageTitle()}</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full"
          >
            <Avatar className="h-10 w-10 border-2 border-white/50">
              <AvatarImage data-ai-hint="person user" src="https://placehold.co/40x40.png" alt="Admin" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">
                  admin@unlife.com
                  </p>
              </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
           <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
           </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <MainSidebar />
        <div className="flex flex-col w-full">
          <AppHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
            {children}
          </main>
        </div>
    </SidebarProvider>
  );
}
