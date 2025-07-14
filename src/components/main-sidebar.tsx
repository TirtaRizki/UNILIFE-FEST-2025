
"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
import { useAuth } from "@/hooks/use-auth";

const Logo = () => {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        const handleStorageChange = () => {
            const storedLogo = localStorage.getItem('appLogo');
            setLogoUrl(storedLogo);
        };
        handleStorageChange(); // Initial load
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    if (logoUrl) {
        return <Image src={logoUrl} alt="Unilife Logo" width={140} height={40} className="object-contain" />;
    }
    return <h1 className="text-3xl font-headline font-bold text-primary">UNILIFE</h1>;
};

export const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ['Admin', 'Panitia', 'Member'] },
  { href: "/users", icon: UserCog, label: "User", roles: ['Admin'] },
  { href: "/committee", icon: Users, label: "Panitia", roles: ['Admin', 'Panitia', 'Member'] },
  { href: "/events", icon: CalendarIcon, label: "Event", roles: ['Admin', 'Panitia', 'Member'] },
  { href: "/lineup", icon: Mic, label: "Line Up", roles: ['Admin', 'Panitia', 'Member'] },
  { href: "/tickets", icon: Ticket, label: "Tiket", roles: ['Admin', 'Panitia', 'Member'] },
  { href: "/banners", icon: ImageIcon, label: "Banner", roles: ['Admin', 'Panitia', 'Member'] },
  { href: "/recap", icon: BookOpen, label: "Recap", roles: ['Admin', 'Panitia', 'Member'] },
  { href: "/about", icon: Info, label: "About", roles: ['Admin', 'Panitia', 'Member'] },
  { href: "/profile", icon: User, label: "Profile", roles: ['Admin', 'Panitia', 'Member'] },
  { href: "/settings", icon: Settings, label: "Settings", roles: ['Admin', 'Panitia', 'Member'] },
];

export function MainSidebar() {
    const pathname = usePathname();
    const { hasRole } = useAuth();

    const isActive = (path: string) => {
        if (path === "/dashboard") return pathname === path;
        return pathname.startsWith(path);
    };

    const visibleNavItems = navItems.filter(item => hasRole(item.roles));

    return (
        <Sidebar>
            <SidebarHeader className="pt-6 pb-8 px-4">
                <div className="h-10 flex items-center">
                    <Logo />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {visibleNavItems.map((item) => (
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
