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
  Calendar,
  BookOpen,
  Image as ImageIcon,
  UserCog,
  LogOut,
} from "lucide-react";

const Logo = () => (
  <div className="flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-2 h-6 w-6 text-primary"
    >
      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
    </svg>
    <h1 className="text-xl font-headline font-semibold">EventFlow</h1>
  </div>
);

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/committee", icon: Users, label: "Kelola Panitia" },
  { href: "/about", icon: Info, label: "Kelola About" },
  { href: "/lineup", icon: Mic, label: "Kelola Line Up" },
  { href: "/events", icon: Calendar, label: "Kelola Event" },
  { href: "/recap", icon: BookOpen, label: "Kelola Recap" },
  { href: "/banners", icon: ImageIcon, label: "Kelola Banner" },
  { href: "/users", icon: UserCog, label: "Kelola User" },
];

export function MainSidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => {
        if (path === "/dashboard") return pathname === path;
        return pathname.startsWith(path);
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Logout">
                    <Link href="/">
                      <LogOut />
                      <span>Logout</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
