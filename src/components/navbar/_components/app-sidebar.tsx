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

type NavLink = { title: string; href: string; children?: NavLink[] };


export default function AppSidebar({ categories,
}: {
  categories: Category[] | null;
}) {
  const links: NavLink[] = [];

  if (categories) {
    const parents = categories.filter((c) => c.parentId === null);

    for (const p of parents) {
      const children = categories
        .filter((c) => c.parentId === p.id && (c.articleCount ?? 0) > 0)
        .map((c) => ({
          title: c.name,
          href: `/category/${c.id}`,
        }));

      const parentHasArticles = (p.articleCount ?? 0) > 0;
      if (!parentHasArticles && children.length === 0) continue;

      links.push({
        title: p.name,
        href: `/category/${p.id}`,
        children,
      });
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
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter></SidebarFooter>
        </Sidebar>
    );
}
