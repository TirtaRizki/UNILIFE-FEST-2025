
"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Info,
  Mic,
  Calendar as CalendarIcon,
  BookOpen,
  ImageIcon,
  UserCog,
  LogOut,
  Ticket,
  User,
  Settings,
} from "lucide-react";

const Logo = () => (
    <h1 className="text-3xl font-headline font-bold text-primary px-4">UNLIFE</h1>
);

export const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/users", icon: UserCog, label: "Kelola User" },
  { href: "/committee", icon: Users, label: "Kelola Panitia"},
  { href: "/events", icon: CalendarIcon, label: "Kelola Event" },
  { href: "/lineup", icon: Mic, label: "Kelola Line Up" },
  { href: "/tickets", icon: Ticket, label: "Kelola Tiket" },
  { href: "/banners", icon: ImageIcon, label: "Kelola Banner" },
  { href: "/recap", icon: BookOpen, label: "Kelola Recap" },
  { href: "/about", icon: Info, label: "Kelola About" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function MainSidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => {
        if (path === "/dashboard") return pathname === path;
        return pathname.startsWith(path);
    };

    return (
        <Sidebar>
            <SidebarHeader className="pt-6 pb-8">
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton 
                                asChild 
                                isActive={isActive(item.href)}
                                className="justify-start data-[active=true]:border-l-4 data-[active=true]:border-sidebar-border data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground rounded-none"
                                variant="ghost"
                            >
                                <Link href={item.href}>
                                    <item.icon className="h-5 w-5" />
                                    <span className="text-base font-medium">{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="justify-start" variant="ghost">
                    <Link href="/">
                      <LogOut className="h-5 w-5"/>
                      <span className="text-base font-medium">Logout</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
