"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { SidebarLink } from "./sidebar-link";

type NavLink = { title: string; href: string };

export function NewsDropdown({ label, links }: { label: string; links: NavLink[] }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover:border-b-primary!  border-2 hover:bg-[#f4ede0]! hover:dark:text-background  text-[16px] cursor-pointer">
                    {label}
                    <ChevronDown className="dark:text-white text-black" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="grid grid-cols-2 min-w-sm p-1">
                {links.map((page) => (
                    <DropdownMenuItem key={page.title} asChild>
                        <div className="text-center justify-center cursor-pointer">
                            <Link href={page.href} className="">
                                {page.title}
                            </Link>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// export function NewsDropdownCollapsible({ label, links }: { label: string; links: NavLink[] }) {
//     return (
//         <Collapsible>
//             <CollapsibleTrigger asChild>
//                 <Button variant="ghost" className="cursor-pointer">
//                     {label}
//                     <ChevronDown color="black" />
//                 </Button>
//             </CollapsibleTrigger>
//             <CollapsibleContent className="grid grid-cols-2 min-w-sm p-1">
//                 {links.map((page) => (
//                     <div key={page.title} >
//                         <Link href={page.href} className="text-center justify-center">
//                             {page.title}
//                         </Link>
//                     </div>
//                 ))}
//             </CollapsibleContent>
//         </Collapsible>
//     );
// }

export function NewsDropdownSM({ label, links }: { label: string; links: NavLink[] }) {
    return (
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="text-lg">
                        {label}
                        <ChevronDown color="black" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="grid grid-cols-2 w-(--radix-dropdown-menu-trigger-width)  p-1">
                    {links.map((page) => (
                        <DropdownMenuItem key={page.title} asChild>
                            <SidebarLink href={page.href}>{page.title}</SidebarLink>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
}
