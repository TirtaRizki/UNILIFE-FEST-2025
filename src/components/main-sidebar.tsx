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
  ImageIcon,
  UserCog,
  LogOut,
  Ticket,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Logo = () => (
    <h1 className="text-2xl font-headline font-bold text-white px-4">UNILIFE</h1>
);

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tickets", icon: Ticket, label: "Kelola Tiket" },
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
            <SidebarHeader className="pt-6 pb-4">
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <div className="flex flex-col items-center gap-2 py-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage data-ai-hint="person user" src="https://placehold.co/80x80.png" alt="Julian" />
                        <AvatarFallback>J</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-white">Julian</p>
                </div>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={isActive(item.href)} className="justify-start data-[active=true]:bg-sidebar-accent">
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
                  <SidebarMenuButton asChild className="justify-start">
                    <Link href="/">
                      <LogOut />
                      <span>Kelola Login</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
