"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NewsDropdownSM } from "./dropdown-menus";
import { SidebarLink } from "./sidebar-link";
import { Category } from "@/lib/types";

export default function AppSidebar({ categories }: { categories: Category[] | null }) {
    const links = [];
    if (categories) {
        for (const c of categories) {
            links.push({ title: c.name, href: `/category/${c.id}` });
        }
    }
    return (
        <Sidebar  variant="sidebar" collapsible="offcanvas">
            <SidebarHeader className="md:pt-50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarLink href="/">Home</SidebarLink>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {/* Dropdown components */}
                <SidebarGroup>
                    <SidebarMenu>
                        <NewsDropdownSM label="News" links={links} />
                        <SidebarMenuItem>
                            <SidebarLink href="/buy-and-sell">Buy &amp; Sell</SidebarLink>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter></SidebarFooter>
        </Sidebar>
    );
}
